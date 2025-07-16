export default class ApiUrlsService {
  private static readonly urls = {
    LOAD_FINANSE_HISTORIA_RACHUNKU:
      'https://rozliczenia.estatecare.pl/iokRozr/DajDrzewoFinHistoria?Rozr=:KONTO_FINANSOWE&DataOd=:DATA_OD&DataDo=:DATA_DO',
    LOAD_DOKUMENTY:
      'https://rozliczenia.estatecare.pl/iokRozr/DajDokSzczegoly?Ident=:DOKUMENT_IDENT&ACzyDlaMenuWsp=:CZY_DLA_MENU_WSPOLNE&ADokDoFakturWsp=:DOK_DO_DAKTURY_WSPOLNE',
  }

  private static readonly URL_PARAMS = {
    KONTO_FINANSOWE: '',
    DATA_OD: '2024-01-01',
    DATA_DO: '2026-01-01',
    DOKUMENT_IDENT: '',
    CZY_DLA_MENU_WSPOLNE: 'false',
    DOK_DO_DAKTURY_WSPOLNE: '',
  }

  public static getUrl(
    type: keyof typeof ApiUrlsService.urls,
    params: { [key: string]: string | number },
  ) {
    const url = ApiUrlsService.urls[type]
    const filledUrl = Object.keys(params).reduce((acc, key) => {
      return acc.replace(`:${key}`, params[key].toString())
    }, url)
    return filledUrl
  }

  public static getFinanseUrl(
    kontoFinansowe: string,
    data_od: string = this.URL_PARAMS.DATA_OD,
    data_do: string = this.URL_PARAMS.DATA_DO,
  ) {
    return ApiUrlsService.getUrl('LOAD_FINANSE_HISTORIA_RACHUNKU', {
      KONTO_FINANSOWE: kontoFinansowe,
      DATA_OD: data_od,
      DATA_DO: data_do,
    })
  }

  public static getDokumentyUrl(
    ident: string,
    czyDlaMenuWspolne: string = 'false',
    doFakturyWspolne: string = 'false',
  ) {
    return ApiUrlsService.getUrl('LOAD_DOKUMENTY', {
      DOKUMENT_IDENT: ident,
      CZY_DLA_MENU_WSPOLNE: czyDlaMenuWspolne,
      DOK_DO_DAKTURY_WSPOLNE: doFakturyWspolne,
    })
  }
}
