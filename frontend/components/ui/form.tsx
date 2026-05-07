"use client"

import * as React from "react"
import {
  Controller,
  FormProvider,
  useFormContext,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form"

export const Form = FormProvider

export function FormField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
>({...props}: ControllerProps<TFieldValues, TName>) {
  return <Controller {...props} />
}

export const FormItem = ({ children }: any) => (
  <div className="space-y-2">{children}</div>
)

export const FormLabel = ({ children, ...props }: any) => (
  <label {...props}>{children}</label>
)

export const FormControl = ({ children }: any) => (
  <div>{children}</div>
)

export const FormMessage = () => {
  const { formState } = useFormContext()
  const error = Object.values(formState.errors)[0]

  if (!error) return null

  return (
    <p className="text-sm text-red-500">
      {error.message?.toString()}
    </p>
  )
}