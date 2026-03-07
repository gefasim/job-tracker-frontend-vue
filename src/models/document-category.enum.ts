export enum DocumentCategoryEnum {
  Transcript = 'Transcript',
  Portfolio = 'Portfolio',
  Recommendation = 'Recommendation',
  OfferLetter = 'Offer Letter',
  Resume = 'Resume',
  CoverLetter = 'Cover Letter',
  WritingSample = 'Writing Sample',
  Certification = 'Certification',
  Other = 'Other',
  JobPost = 'Job Post',
}

export type DocumentCategoryType = `${DocumentCategoryEnum}`
