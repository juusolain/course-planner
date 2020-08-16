## Regexes for parsing data from Wilma

### Match course key
`/[A-Ö]{1,5}[0-9]{2,3}/g`

### Match group key
`/[A-Ö]{1,5}[0-9]{2,3}\.[D1-9]{1,3}/g`

### Match teacher
`/(?<=Opettaja: )[A-Ö]{3} .*/g`