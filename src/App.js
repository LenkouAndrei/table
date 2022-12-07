import { parse } from 'query-string';
import withRouter from './hoc/withRouter';
import { useEffect, useState, useRef } from 'react';
import useOutsideClick from './hooks/useOutsideClick'

import './styles.css';

const formGrid = (height=0, width=0) => {
  const formCells = Array.from({ length: width }, () => ({ text: '', selected: false }));
  const formRows = Array.from({ length: height }, () => formCells);
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
        console.log(rowIdx, cellIdx, isCellInSelectedRange(selectedRange, {rowIdx, cellIdx}));
        return { ...cellConfig, selected: isCellInSelectedRange(selectedRange, {rowIdx, cellIdx}) }
      })
    })
}

const App = ({ location }) => {
  const [grid, setGrid] = useState([['First cell']]);
  const { height = 0, width = 0 } = parse(location.search);
  const [hoveredCellDataset, setHoveredCellDataset] = useState(null);
  const [isListenMouseMove, setIsListenMouseMove] = useState(false);
  const [startSelectedPosition, setStartSelectedPosition] = useState(null);
  const ref = useRef();
  useOutsideClick(ref, () => setIsListenMouseMove(false))
  useEffect(() => {
    const newGrid = formGrid(height, width);
    setGrid(newGrid)
  }, [height, width]);
  useEffect(() => {
    // console.log('hoveredCellDataset: ', hoveredCellDataset);
    // console.log('startSelectedPosition: ', startSelectedPosition);
    if (hoveredCellDataset) {
      const selectedRange = calculateSelectedRange(startSelectedPosition, hoveredCellDataset);
      console.log('selectedRange: ', selectedRange);
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

  return (
    <div>
      <div className='controls'>
        <button data-merge-button>Merge</button>
        <button data-separate-button>Separate</button>
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
                  colSpan={1}
                  rowSpan={1}
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