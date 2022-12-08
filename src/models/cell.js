export class Cell {
    constructor({ firstCell, firstRow }) {
        this.rowIndex = firstRow;
        this.colIndex = firstCell;
        this.text = `cell: ${firstCell}, row: ${firstRow}`;
        this.selected = false;
        this.colSpan = 1;
        this.rowSpan = 1;
        this.isVisible = true;
        this.startRowPosition = firstRow;
        this.startColPosition = firstCell;
    }
    toggleSelection() {
        this.selected = !this.selected;
    }
    getCellBorder() {
        return {
            top: this.rowIndex,
            right: this.colIndex + this.colSpan - 1,
            bottom: this.rowIndex + this.rowSpan - 1,
            left: this.colIndex
        }
    }
    changeWidth(width) {
        this.colSpan = width;
    }
    changeHeight(height) {
        this.rowSpan = height;
    }
    isCrossTopLine(cellBorder, top, bottom) {
        return cellBorder.top > top && cellBorder.top > bottom;
    }
    isCrossLeftLine(cellBorder, left, right) {
        return cellBorder.left > left && cellBorder.left < right;
    }
    isRangeInside(cellBorder, {top, bottom, right, left}) {
        return cellBorder.top <= top && cellBorder.bottom >= bottom
            && cellBorder.left <= left && cellBorder.right >= right;
    }
    isFullyInRange({ startCol: left, endCol: right, startRow: top, endRow: bottom }) {
        const cellBorder = this.getCellBorder();
        return cellBorder.top >= top && cellBorder.bottom <= bottom
            && cellBorder.left >= left && cellBorder.right <= right;
    }
    isPartiallyInRange({ startCol: left, endCol: right, startRow: top, endRow: bottom }) {
        const cellBorder = this.getCellBorder();
        const isRangeLeftOfCell = right < cellBorder.left;
        const isRangeRightOfCell = left > cellBorder.right;
        const isRangeAboveCell = top > cellBorder.bottom;
        const isRangeBelowCell = bottom < cellBorder.top;
    
        return !( isRangeLeftOfCell || isRangeRightOfCell || isRangeAboveCell || isRangeBelowCell );
    }
}