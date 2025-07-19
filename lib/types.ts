export interface Image {
  id: number
  image: string
  newsId: number
}

export interface News {
  id: number
  createdAt: string
  title_az: string
  title_en: string
  title_ru: string
  description_az: string
  description_en: string
  description_ru: string
  images: Image[]
}
