export class Cell {
    constructor({ firstCell, firstRow }) {
        this.rowIndex = firstRow;
        this.colIndex = firstCell;
        this.text = `cell: ${firstCell}, row: ${firstRow}`;
        this.selected = false;
        this.colSpan = 1;
        this.rowSpan = 1;
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
    isCrossTopLine(cellBorder, top) {
        return cellBorder.top < top && cellBorder.bottom > top;
    }
    isCrossBottomLine(cellBorder, bottom) {
        return cellBorder.top < bottom && cellBorder.bottom > bottom;
    }
    isCrossRightLine(cellBorder, right) {
        return cellBorder.left < right && cellBorder.right > right;
    }
    isCrossLeftLine(cellBorder, left) {
        return cellBorder.left < left && cellBorder.right > left;
    }
    isFullyInRange({ startCol: left, endCol: right, startRow: top, endRow: bottom }) {
        const cellBorder = this.getCellBorder();
        return cellBorder.top >= top && cellBorder.bottom <= bottom
            && cellBorder.left >= left && cellBorder.right <= right;
    }
    isPartiallyInRange({ startCol: left, endCol: right, startRow: top, endRow: bottom }) {
        const cellBorder = this.getCellBorder();
        return this.isCrossTopLine(cellBorder, top)
            || this.isCrossBottomLine(cellBorder, bottom)
            || this.isCrossRightLine(cellBorder, right)
            || this.isCrossLeftLine(cellBorder, left);
    }
}