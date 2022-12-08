class Selection {
    constructor() {
        this.startPosition = null;
        this.endPosition = null;
        this.currentElement = null;
    }
    getCellsInRange = (grid) => {
        const { minRow: startRow, minCol: startCol, maxRow: endRow, maxCol: endCol }
            = this.normolizeSelectedRange(this.startPosition, this.endPosition);
        return grid.reduce((acc, cells) => {
          cells.forEach(cell => {
            if (cell.isFullyInRange({ startCol, endCol, startRow, endRow })) {
              acc.fullyInRange.push(cell)
            } else if (cell.isPartiallyInRange({ startCol, endCol, startRow, endRow })) {
              acc.partiallyInRange.push(cell)
            }
          });
          return acc;
        }, { fullyInRange: [], partiallyInRange: [] })
    }
    normolizeSelectedRange = (startPos, endPos) => {
        return {
            minRow: Math.min(startPos.rowIndex, endPos.rowIndex),
            minCol: Math.min(startPos.colIndex, endPos.colIndex),
            maxRow: Math.max(startPos.rowIndex, endPos.rowIndex),
            maxCol: Math.max(startPos.colIndex, endPos.colIndex)
        }
    }
    set end(value) {
        this.endPosition = {
            rowIndex: value.rowIndex,
            colIndex: value.colIndex,
        }
    }
    expandPositions(grid) {
        const { fullyInRange, partiallyInRange } = this.getCellsInRange(grid);
        if (!partiallyInRange.length) return fullyInRange;
        
        const coords = partiallyInRange
            .reduce((acc, cell) => {
                const cellCoords = cell.getCellBorder();
                acc.endRow = Math.abs(this.startPosition.rowIndex - cellCoords.top) > Math.abs(this.startPosition.rowIndex - cellCoords.bottom)
                    ? cellCoords.top : cellCoords.bottom;
                acc.endCol = Math.abs(this.startPosition.colIndex - cellCoords.left) > Math.abs(this.startPosition.colIndex - cellCoords.right)
                    ? cellCoords.left : cellCoords.right;
                return acc;
            }, { endCol: 0, endRow: 0 });
        this.end = { rowIndex: coords.endRow, colIndex: coords.endCol };
        return this.expandPositions(grid)
    }
}
export const selection = new Selection();