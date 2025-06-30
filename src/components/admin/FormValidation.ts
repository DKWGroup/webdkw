import React from 'react';

// Utility functions for form validation

export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: any) => string | null
}

export interface ValidationRules {
  [key: string]: ValidationRule
}

export interface ValidationErrors {
  [key: string]: string
}

export class FormValidator {
  private rules: ValidationRules
  
  constructor(rules: ValidationRules) {
    this.rules = rules
  }

  validate(data: Record<string, any>): ValidationErrors {
    const errors: ValidationErrors = {}

    Object.keys(this.rules).forEach(field => {
      const rule = this.rules[field]
      const value = data[field]
      const error = this.validateField(value, rule, field)
      
      if (error) {
        errors[field] = error
      }
    })

    return errors
  }

  validateField(value: any, rule: ValidationRule, fieldName: string): string | null {
    // Required validation
    if (rule.required && (!value || (typeof value === 'string' && !value.trim()))) {
      return `${fieldName} jest wymagane`
    }

    // Skip other validations if value is empty and not required
    if (!value || (typeof value === 'string' && !value.trim())) {
      return null
    }

    // String validations
    if (typeof value === 'string') {
      // Min length validation
      if (rule.minLength && value.length < rule.minLength) {
        return `${fieldName} musi mieć minimum ${rule.minLength} znaków`
      }

      // Max length validation
      if (rule.maxLength && value.length > rule.maxLength) {
        return `${fieldName} nie może przekraczać ${rule.maxLength} znaków`
      }

      // Pattern validation
      if (rule.pattern && !rule.pattern.test(value)) {
        return `${fieldName} ma nieprawidłowy format`
      }
    }

    // Custom validation
    if (rule.custom) {
      return rule.custom(value)
    }

    return null
  }

  // Static validation rules for common fields
  static commonRules = {
    title: {
      required: true,
      maxLength: 100,
      custom: (value: string) => {
        if (value && value.length < 3) {
          return 'Tytuł musi mieć minimum 3 znaki'
        }
        return null
      }
    },

    slug: {
      required: true,
      pattern: /^[a-z0-9-]+$/,
      custom: (value: string) => {
        if (value && (value.startsWith('-') || value.endsWith('-'))) {
          return 'Slug nie może zaczynać ani kończyć się myślnikiem'
        }
        return null
      }
    },

    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      custom: (value: string) => {
        if (value && value.length > 254) {
          return 'Email jest za długi'
        }
        return null
      }
    },

    url: {
      pattern: /^https?:\/\/.+/,
      custom: (value: string) => {
        if (value && !value.startsWith('http')) {
          return 'URL musi zaczynać się od http:// lub https://'
        }
        return null
      }
    },

    content: {
      required: true,
      minLength: 10,
      custom: (value: string) => {
        if (value && value.replace(/<[^>]*>/g, '').trim().length < 10) {
          return 'Treść musi mieć minimum 10 znaków (bez HTML)'
        }
        return null
      }
    },

    metaDescription: {
      maxLength: 160,
      custom: (value: string) => {
        if (value && value.length > 0 && value.length < 120) {
          return 'Meta opis powinien mieć 120-160 znaków dla optymalnego SEO'
        }
        return null
      }
    }
  }

  // File validation utilities
  static validateFile(file: File, options: {
    maxSize?: number // in bytes
    allowedTypes?: string[]
    required?: boolean
  } = {}): string | null {
    const { maxSize = 5 * 1024 * 1024, allowedTypes = ['image/jpeg', 'image/png'], required = false } = options

    if (!file) {
      return required ? 'Plik jest wymagany' : null
    }

    if (maxSize && file.size > maxSize) {
      const maxSizeMB = Math.round(maxSize / (1024 * 1024))
      return `Plik jest za duży. Maksymalny rozmiar: ${maxSizeMB}MB`
    }

    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      const allowedExtensions = allowedTypes.map(type => type.split('/')[1].toUpperCase()).join(', ')
      return `Nieprawidłowy format pliku. Dozwolone: ${allowedExtensions}`
    }

    return null
  }

  // Image validation with dimensions
  static validateImage(file: File, options: {
    maxSize?: number
    minWidth?: number
    minHeight?: number
    maxWidth?: number
    maxHeight?: number
    aspectRatio?: number // width/height
  } = {}): Promise<string | null> {
    return new Promise((resolve) => {
      const basicValidation = FormValidator.validateFile(file, {
        maxSize: options.maxSize,
        allowedTypes: ['image/jpeg', 'image/png', 'image/webp']
      })

      if (basicValidation) {
        resolve(basicValidation)
        return
      }

      const img = new Image()
      img.onload = () => {
        const { naturalWidth: width, naturalHeight: height } = img

        if (options.minWidth && width < options.minWidth) {
          resolve(`Obraz musi mieć minimum ${options.minWidth}px szerokości`)
          return
        }

        if (options.minHeight && height < options.minHeight) {
          resolve(`Obraz musi mieć minimum ${options.minHeight}px wysokości`)
          return
        }

        if (options.maxWidth && width > options.maxWidth) {
          resolve(`Obraz nie może przekraczać ${options.maxWidth}px szerokości`)
          return
        }

        if (options.maxHeight && height > options.maxHeight) {
          resolve(`Obraz nie może przekraczać ${options.maxHeight}px wysokości`)
          return
        }

        if (options.aspectRatio) {
          const ratio = width / height
          const tolerance = 0.1
          if (Math.abs(ratio - options.aspectRatio) > tolerance) {
            resolve(`Obraz musi mieć proporcje ${options.aspectRatio}:1`)
            return
          }
        }

        resolve(null)
      }

      img.onerror = () => {
        resolve('Nie można wczytać obrazu')
      }

      img.src = URL.createObjectURL(file)
    })
  }

  // Slug generation utility
  static generateSlug(text: string): string {
    return text
      .toLowerCase()
      .trim()
      // Replace Polish characters
      .replace(/ą/g, 'a')
      .replace(/ć/g, 'c')
      .replace(/ę/g, 'e')
      .replace(/ł/g, 'l')
      .replace(/ń/g, 'n')
      .replace(/ó/g, 'o')
      .replace(/ś/g, 's')
      .replace(/ź/g, 'z')
      .replace(/ż/g, 'z')
      // Remove special characters except spaces and hyphens
      .replace(/[^a-z0-9\s-]/g, '')
      // Replace spaces with hyphens
      .replace(/\s+/g, '-')
      // Remove multiple consecutive hyphens
      .replace(/-+/g, '-')
      // Remove leading/trailing hyphens
      .replace(/^-+|-+$/g, '')
  }

  // Meta description generation from content
  static generateMetaDescription(content: string, maxLength: number = 155): string {
    return content
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim()
      .substring(0, maxLength)
      .replace(/\s+\S*$/, '') // Remove partial word at the end
      .trim()
  }

  // Excerpt generation from content
  static generateExcerpt(content: string, maxLength: number = 200): string {
    const text = content
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim()

    if (text.length <= maxLength) {
      return text
    }

    return text
      .substring(0, maxLength)
      .replace(/\s+\S*$/, '') // Remove partial word at the end
      .trim() + '...'
  }
}

// Debounced validation hook for real-time validation
export const useDebounce = (value: any, delay: number) => {
  const [debouncedValue, setDebouncedValue] = React.useState(value)

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}