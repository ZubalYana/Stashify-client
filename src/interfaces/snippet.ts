export default interface snippet{
    id: string,
    code: string,
    title: string,
    description: string,
    language: string,
    tags: string[],
    project_id: number | null,
    collections: { id: number, name: string }[]
}