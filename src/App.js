import { parse } from 'query-string';
import withRouter from './hoc/withRouter';
import { useEffect, useState } from 'react';

import './styles.css';

const formGrid = (height=0, width=0) => {
  const formCells = Array.from({ length: width }, (el, idx) => idx.toString());
  const formRows = Array.from({ length: height }, () => formCells);
  return formRows;
}

const App = ({ location }) => {
  const [grid, setGrid] = useState([['First cell']]);
  const { height = 0, width = 0 } = parse(location.search);
  useEffect(() => {
    const newGrid = formGrid(height, width);
    setGrid(newGrid)
  }, [height, width])

  return (
    <div>
      <div className='controls'>
        <button data-merge-button>Merge</button>
        <button data-separate-button>Separate</button>
      </div>
      <table>
        <tbody>
          {grid.map((gridRow, rowIndex) => (
            <tr key={rowIndex}>
              {gridRow.map((gridCell, colIndex) => (
                <td
                  data-selected={false}
                  data-row-index={rowIndex}
                  data-col-index={colIndex}
                  key={colIndex}
                  colSpan={1}
                  rowSpan={1}
                >
                  {gridCell}
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