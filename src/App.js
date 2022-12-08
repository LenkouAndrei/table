import { parse } from 'query-string';
import withRouter from './hoc/withRouter';
import { useEffect, useState, useRef } from 'react';
import useOutsideClick from './hooks/useOutsideClick';
import cloneDeep from 'lodash.clonedeep';
import { Cell } from './models/cell';
import { selection } from './models/selection';

import './styles.css';

const formGrid = (height=0, width=0) => {
  const formCells = (rowIdx) => Array.from({ length: width }, (_cell, cellIdx) => {
    return new Cell({ firstCell: cellIdx, firstRow: rowIdx });
  });
  const formRows = Array.from({ length: height }, (_row, rowIdx) => formCells(rowIdx));
  return formRows;
}

const mergeCells = ({ minRow, minCol, maxRow, maxCol }) => (grid) => {
  const expandedCell = grid[minRow][minCol];
  expandedCell.colSpan = maxCol - minCol + 1;
  expandedCell.rowSpan = maxRow - minRow + 1;
  const newGrid = grid.map(
    (cells) => cells.filter((cell) => !cell.selected || cell === expandedCell)
  )
  return newGrid;
}

const App = ({ location }) => {
  const [grid, setGrid] = useState([['First cell']]);
  const { height = 0, width = 0 } = parse(location.search);
  const [isListenMouseMove, setIsListenMouseMove] = useState(false);
  const ref = useRef();
  useOutsideClick(ref, () => setIsListenMouseMove(false));
  const cleanSelection = (grid) => {
    return grid.map(cells => cells.map(cell => {
      cell.selected = false;
      return cell;
    }))
  }

  useEffect(() => {
    const newGrid = formGrid(height, width);
    setGrid(newGrid)
  }, [height, width]);

  const updateGrid = ({ rowIndex, colIndex }, target) => {
    selection.currentElement = target;
    selection.end = { rowIndex: +rowIndex, colIndex: +colIndex };
    const cleanGrid = cleanSelection(grid);
    const newGrid = cloneDeep(cleanGrid);
    const cellsInRange = selection.expandPositions(newGrid);
    cellsInRange.forEach(cell => cell.selected = true);
    setGrid(newGrid);
  }

  const handleMousedown = (event) => {
    setIsListenMouseMove(true);
    const { rowIndex, colIndex } = event.target.dataset;
    selection.startPosition = { rowIndex: +rowIndex, colIndex: +colIndex };
    updateGrid({ rowIndex: +rowIndex, colIndex: +colIndex }, event.target);
  }

  const handleMouseMove = (event) => {
    if (!isListenMouseMove || selection.currentElement === event.target) return;
    const { rowIndex, colIndex } = event.target.dataset;
    updateGrid({ rowIndex: +rowIndex, colIndex: +colIndex }, event.target);
  }

  const handleMouseup = (event) => {
    setIsListenMouseMove(false);
  }

  const onSeparateBtnClick = () => {
    console.log('Separate Cells')
  }
  
  const onMergeBtnClick = () => {
    const selectedRange = selection.normolizeSelectedRange(selection.startPosition, selection.endPosition);
    setGrid(mergeCells(selectedRange));
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
                  data-row-index={gridCell.rowIndex}
                  data-col-index={gridCell.colIndex}
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