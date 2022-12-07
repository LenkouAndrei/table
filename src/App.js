import { parse } from 'query-string';
import withRouter from './hoc/withRouter';
import { useEffect, useState, useRef } from 'react';
import useOutsideClick from './hooks/useOutsideClick'

import './styles.css';

const formGrid = (height=0, width=0) => {
  const formCells = (rowIdx) => Array.from({ length: width }, (_cell, cellIdx) => {
    const text = `rows: ${rowIdx}, cells: ${cellIdx}`;
    return { text, selected: false, colSpan: 1, rowSpan: 1 }
  });
  const formRows = Array.from({ length: height }, (_row, rowIdx) => formCells(rowIdx));
  return formRows;
}

const calculateSelectedRange = (startPos, endPos) => {
  return {
    startCol: Math.min(startPos.colIndex, endPos.colIndex),
    endCol: Math.max(startPos.colIndex, endPos.colIndex),
    startRow: Math.min(startPos.rowIndex, endPos.rowIndex),
    endRow: Math.max(startPos.rowIndex, endPos.rowIndex),
  }
}

const isCellInSelectedRange = (
  { startCol, endCol, startRow, endRow },
  { rowIdx, cellIdx }
) => {
  return startRow <= rowIdx && endRow >= rowIdx
    && startCol <= cellIdx && endCol >= cellIdx;
}

const recalculateGrid = (selectedRange) => (grid) => {
  return grid
    .map((rows, rowIdx) => {
      return rows.map((cellConfig, cellIdx) => {
        return { ...cellConfig, selected: isCellInSelectedRange(selectedRange, {rowIdx, cellIdx}) }
      })
    })
}

const isUnitedCell = (rowIdx, startRow, cellIdx, startCol) => rowIdx === startRow && cellIdx === startCol;
const mergeCells = ({ startCol, endCol, startRow, endRow }) => (grid) => {
  const cell = grid[startRow][startCol];
  cell.colSpan = endCol - startCol + 1;
  cell.rowSpan = endRow - startRow + 1;
  const newGrid = grid.map(
    (row, rowIdx) => row.filter((cell, cellIdx) => !cell.selected || isUnitedCell(rowIdx, startRow, cellIdx, startCol))
  )
  console.log('newGrid: ', JSON.parse(JSON.stringify(newGrid)))
  return newGrid;
}

const App = ({ location }) => {
  const [grid, setGrid] = useState([['First cell']]);
  const { height = 0, width = 0 } = parse(location.search);
  const [hoveredCellDataset, setHoveredCellDataset] = useState(null);
  const [isListenMouseMove, setIsListenMouseMove] = useState(false);
  const [startSelectedPosition, setStartSelectedPosition] = useState(null);
  // const [selectedRange, setSelectedRange] = useState();
  const ref = useRef();
  useOutsideClick(ref, () => setIsListenMouseMove(false))
  useEffect(() => {
    const newGrid = formGrid(height, width);
    setGrid(newGrid)
  }, [height, width]);
  useEffect(() => {
    if (hoveredCellDataset) {
      const selectedRange = calculateSelectedRange(startSelectedPosition, hoveredCellDataset);
      setGrid(recalculateGrid(selectedRange))
    }
  }, [hoveredCellDataset])

  const handleMousedown = (event) => {
    setIsListenMouseMove(true);
    const { rowIndex, colIndex }= event.target.dataset;
    setStartSelectedPosition({ rowIndex, colIndex });
    setHoveredCellDataset({ rowIndex, colIndex });
  }

  const handleMouseup = (event) => {
    setIsListenMouseMove(false);
  }

  const handleMouseMove = (event) => {
    if (!isListenMouseMove) return;
    setHoveredCellDataset(event.target.dataset);
  }

  const onSeparateBtnClick = () => {
    console.log('Separate Cells')
  }
  
  const onMergeBtnClick = () => {
    const selectedRange = calculateSelectedRange(startSelectedPosition, hoveredCellDataset);
    setGrid(mergeCells(selectedRange));
    console.log('selectedRange: ', selectedRange)
  }

  return (
    <div>
      <div className='controls'>
        <button data-merge-button onClick={onMergeBtnClick}>Merge</button>
        <button data-separate-button onClick={onSeparateBtnClick}>Separate</button>
      </div>
      <table ref={ref}>
        <tbody>
          {grid.map((gridRow, rowIndex) => (
            <tr key={rowIndex}>
              {gridRow.map((gridCell, colIndex) => (
                <td
                  data-selected={gridCell.selected}
                  data-row-index={rowIndex}
                  data-col-index={colIndex}
                  key={colIndex}
                  colSpan={gridCell.colSpan}
                  rowSpan={gridCell.rowSpan}
                  onMouseDown={handleMousedown}
                  onMouseUp={handleMouseup}
                  onMouseMove={handleMouseMove}
                >
                  {gridCell.text}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default withRouter(App);