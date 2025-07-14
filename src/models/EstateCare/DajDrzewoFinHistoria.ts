export interface HistoriaRachunku {
  McGranicyDok: string
  CzySaDokPoDacieGrDok: boolean
  McNajstarszegoDok: string
  CzyKwotyUzwglParowDoPrzyszDok: boolean
  UznaniaPrzyszle: number
  ObciazeniaPrzyszle: number
  DoZaplatyNaMc: number
  NadplataNaMc: number
  Finanse: Finanse[]
  SzczegolyDoZaplaty: string[]
  SzczegolyNadplaty: string[]
  Ident: number
  Osoba: string
  Opis: string
  Ulica: string
  NrLok: string
  NazwaZarzadcy: string
  DoZaplaty: number
  Nadplata: number
}
export interface Dokument {
  Ident?: string
  DokId?: number
  RejId?: number
  RozrId?: number
  GrpRejId?: number
  Rodzaj?: string
  Opis?: string
  KontoFin?: string
  Numer?: string
  DataDok?: string
  TermPl?: string
  Kwota?: number
  KwotaDoZapl?: number
  Saldo?: number
  RachunekB?: string
  OpisPltInet?: string
  Ikona?: string
  WybraneDoZapl?: boolean
  CzyObciazenie?: boolean
  CzyDodDoPar?: boolean
  CzyNalDoParDod?: boolean
  StrKsg?: string
  CzyBO?: boolean
  CzyKorekta?: boolean
  CzyDokSym?: boolean
  Szczegoly?: Record<string, string> //Szczegoly
  SzczegolyWew?: Record<string, string>
  SklejoneDok?: null
  SzczegolyDokZak?: Record<string, string>
}

export interface Pozycje {
  Nadplata: number
  DoZaplaty: number
  RejIdent: number
  GrpIdent: number
  McStanu?: string | null
  Opis: string
  Obciazenia: number
  Uznania: number
  Saldo: number
  Pozycje?: Pozycje[] | null
  Dokument?: Dokument | Record<string, string>
}

export interface Finanse {
  Nadplata: number
  DoZaplaty: number
  RejIdent: number
  GrpIdent: number
  McStanu?: string | null
  Opis: string
  Obciazenia: number
  Uznania: number
  Saldo: number
  Pozycje?: Pozycje[] | null
  Dokument?: Dokument | Record<string, string>
}
