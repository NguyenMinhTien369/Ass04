export interface User { id: string; username: string; admin: boolean }
export interface Question { _id: string; text: string; options: string[]; correctAnswerIndex: number; keywords: string[] }
export type QuestionInput = Omit<Question, '_id'>
export interface Quiz { _id: string; title: string; description: string; questions: Question[] }
