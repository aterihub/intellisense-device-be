declare module 'mqtt-pattern' {
  function exec(pattern: string, topic: string): object | null
  function matches(pattern: string, topic: string): boolean
  function extract(pattern: string, topic: string): object
  function fill(pattern: string, params: Object): string
  function clean(pattern: string): string
}
