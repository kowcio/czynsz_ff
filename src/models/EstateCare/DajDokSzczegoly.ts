/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Parowanie {
  Numer: string
  Opis: string
  Kwota: number
  KwotaParowania: number
  StrKsg: string
  TermPl: string
}

export interface Pozycja {
  SkladnikOpl: string
  Stawka: string
  Cena: number
  Ilosc: number
  Netto: number
  Vat: number
  Brutto: number
  Opis: string
  CzyPrzedKorekta: boolean
  Lokal: string
  OkresRozl: string
}

export interface Szczegoly {
  TypFaktury: string
  Pozycje: Pozycja[]
  Lokale: null
  Uwagi: string
  Url: string
  CzyUznanie: boolean
  Parowania: Parowanie[]
}

export interface DocumentSzczegoly {
  Ident: string
  DokId: number
  RejId: number
  RozrId: number
  GrpRejId: number
  Rodzaj: string
  Opis: string
  KontoFin: string
  Numer: string
  DataDok: string
  TermPl: string
  Kwota: number
  KwotaDoZapl: number
  Saldo: number
  RachunekB: string
  OpisPltInet: string
  Ikona: string
  WybraneDoZapl: boolean
  CzyObciazenie: boolean
  CzyDodDoPar: boolean
  CzyNalDoParDod: boolean
  StrKsg: string
  CzyBO: boolean
  CzyKorekta: boolean
  CzyDokSym: boolean
  Szczegoly: Szczegoly
  SzczegolyWew: Record<string, any>
  SklejoneDok: null
  SzczegolyDokZak: Record<string, any>
}
