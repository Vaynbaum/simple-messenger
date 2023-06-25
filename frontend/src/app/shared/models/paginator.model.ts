export class PaginatorData<Type> {
  constructor(
    public items: Type[],
    public to_next?: string,
    public to_current?: string
  ) {}
}
