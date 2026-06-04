import type { MultipartFile } from '@fastify/multipart'
import type { Prisma } from '@interviewos/database'
import type { AnalyzeResumeInput, AnalyzeResumeResult, ResumeAnalysis } from '@interviewos/types'
import { BadRequestException, Injectable } from '@nestjs/common'
import type { FastifyRequest } from 'fastify'
import mammoth from 'mammoth'
import { PDFParse } from 'pdf-parse'

import { AIGateway } from '../../ai/ai.gateway'
import { UsersRepository } from '../users/users.repository'
import { ResumeRepository } from './resume.repository'

type CurrentUserLike = {
  id?: string
}

type MultipartRequest = FastifyRequest & {
  file: () => Promise<MultipartFile | undefined>
}

type StoredResumeAnalysisResult = AnalyzeResumeResult & {
  targetRole: string
  targetLevel: ResumeAnalysis['targetLevel']
  fileName: string | null
}

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024
const ALLOWED_EXTENSIONS = new Set(['.pdf', '.docx', '.txt'])

@Injectable()
export class ResumeService {
  constructor(
    private readonly resumeRepository: ResumeRepository,
    private readonly usersRepository: UsersRepository,
    private readonly aiGateway: AIGateway,
  ) {}

  async uploadResume(currentUser: unknown, request: FastifyRequest) {
    const user = await this.usersRepository.ensureUserById(this.resolveUserId(currentUser))

    if (!user.profile) {
      throw new BadRequestException('Complete onboarding before uploading your resume.')
    }

    const upload = await this.readUpload(request as MultipartRequest)
    const resumeText = await extractResumeText(upload)

    if (!resumeText.trim()) {
      throw new BadRequestException('We could not extract readable text from that file.')
    }

    const analysis = await this.aiGateway.analyzeResume(
      {
        resumeText,
        targetRole: user.profile.targetRole,
        targetLevel: user.profile.targetLevel as unknown as AnalyzeResumeInput['targetLevel'],
      },
      { userId: user.id },
    )

    const stored = await this.resumeRepository.createAnalysis(user.id, {
      rawText: resumeText,
      analysisResult: {
        ...analysis.result,
        targetRole: user.profile.targetRole,
        targetLevel: user.profile.targetLevel,
        fileName: upload.filename,
      } as Prisma.InputJsonValue,
      aiMetadata: analysis.metadata as unknown as Prisma.InputJsonValue,
    })

    return this.toResumeAnalysis(stored)
  }

  async findLatest(currentUser: unknown) {
    const user = await this.usersRepository.ensureUserById(this.resolveUserId(currentUser))
    const latest = await this.resumeRepository.findLatestAnalysis(user.id)
    return latest ? this.toResumeAnalysis(latest) : null
  }

  private async readUpload(request: MultipartRequest) {
    const file = await request.file()

    if (!file) {
      throw new BadRequestException('Resume file is required.')
    }

    const extension = getFileExtension(file.filename)
    if (!ALLOWED_EXTENSIONS.has(extension)) {
      throw new BadRequestException('Only PDF, DOCX, and TXT files are supported.')
    }

    try {
      const buffer = await file.toBuffer()
      if (buffer.byteLength > MAX_FILE_SIZE_BYTES) {
        throw new BadRequestException('Resume file must be 5 MB or smaller.')
      }

      return {
        buffer,
        extension,
        filename: file.filename,
      }
    } catch (error) {
      if (isFileTooLargeError(error)) {
        throw new BadRequestException('Resume file must be 5 MB or smaller.')
      }

      throw error
    }
  }

  private resolveUserId(currentUser: unknown): string | undefined {
    return (currentUser as CurrentUserLike | undefined)?.id
  }

  private toResumeAnalysis(record: {
    id: string
    userId: string
    rawText: string | null
    analysisResult: Prisma.JsonValue | null
    createdAt: Date
  }): ResumeAnalysis {
    const parsed = parseStoredAnalysisResult(record.analysisResult)

    return {
      id: record.id,
      userId: record.userId,
      resumeText: record.rawText ?? '',
      score: parsed.score,
      strengths: parsed.strengths,
      gaps: parsed.gaps,
      recommendations: parsed.recommendations,
      keySkillsFound: parsed.keySkillsFound,
      targetRole: parsed.targetRole,
      targetLevel: parsed.targetLevel,
      fileName: parsed.fileName,
      analyzedAt: record.createdAt,
    }
  }
}

async function extractResumeText(upload: {
  buffer: Buffer
  extension: string
}) {
  if (upload.extension === '.txt') {
    return upload.buffer.toString('utf-8').trim()
  }

  if (upload.extension === '.docx') {
    const result = await mammoth.extractRawText({ buffer: upload.buffer })
    return result.value.trim()
  }

  const parser = new PDFParse({ data: upload.buffer })

  try {
    const result = await parser.getText()
    return result.text.trim()
  } finally {
    await parser.destroy()
  }
}

function parseStoredAnalysisResult(value: Prisma.JsonValue | null): StoredResumeAnalysisResult {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new BadRequestException('Stored resume analysis is invalid.')
  }

  const record = value as Record<string, unknown>
  return {
    score: readNumber(record.score),
    strengths: readStringArray(record.strengths),
    gaps: readStringArray(record.gaps),
    recommendations: readStringArray(record.recommendations),
    keySkillsFound: readStringArray(record.keySkillsFound),
    targetRole: readString(record.targetRole),
    targetLevel: readString(record.targetLevel) as ResumeAnalysis['targetLevel'],
    fileName: record.fileName == null ? null : readString(record.fileName),
  }
}

function readString(value: unknown) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new BadRequestException('Stored resume analysis is invalid.')
  }

  return value
}

function readNumber(value: unknown) {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    throw new BadRequestException('Stored resume analysis is invalid.')
  }

  return value
}

function readStringArray(value: unknown) {
  if (!Array.isArray(value) || value.some((item) => typeof item !== 'string' || !item.trim())) {
    throw new BadRequestException('Stored resume analysis is invalid.')
  }

  return value
}

function getFileExtension(filename: string) {
  const lastDot = filename.lastIndexOf('.')
  return lastDot >= 0 ? filename.slice(lastDot).toLowerCase() : ''
}

function isFileTooLargeError(error: unknown) {
  const candidate =
    typeof error === 'object' && error !== null
      ? (error as { code?: unknown; message?: unknown })
      : null

  return (
    candidate !== null &&
    ((typeof candidate.code === 'string' && candidate.code === 'FST_REQ_FILE_TOO_LARGE') ||
      (typeof candidate.message === 'string' && candidate.message.includes('too large')))
  )
}
