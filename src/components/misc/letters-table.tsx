import { useMemo } from 'react'
import Table from 'react-bootstrap/Table'

type LettersTableProps = {
  letters?: string
  rowLength?: number
}

const LettersTable: React.FC<LettersTableProps> = ({
  rowLength: $rowLength = 10,
  letters = '',
}) => {
  const rowLength = useMemo(() => {
    const $$rowLength = Math.ceil($rowLength)
    if ($$rowLength < 1) return 1
    if ($$rowLength > 10) return 10
    return $$rowLength
  }, [$rowLength])

  return (
    <Table bordered size="sm">
      <tbody>
        {((lettersList) => {
          const $rows = []
          for (let i = 0; i < lettersList.length; i += rowLength) {
            $rows.push(
              <tr key={i} className="border-bottom-0">
                {lettersList.slice(i, i + rowLength).map((letter, $index) => (
                  <td key={$index} className="border-bottom text-center">
                    {letter}
                  </td>
                ))}
              </tr>
            )
          }
          return $rows
        })(letters.split(''))}
      </tbody>
    </Table>
  )
}

LettersTable.displayName = 'LettersTable'

export default LettersTable
