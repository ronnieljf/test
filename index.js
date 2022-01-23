const fs = require("fs");
const test = (module.exports = {
  readMatrix() {
    //
    let matrix = null;
    let isValidString = null;

    try {
      matrix = fs.readFileSync("matrix.txt").toString();
    } catch (error) {
      console.log(error);
      matrix = null;
    }

    if (!matrix) {
      console.log("Matrix is null");
      return;
    }

    matrix = matrix
      .replace(new RegExp(" ", "g"), "")
      .replace(new RegExp("\r", "g"), "")
      .trim();

    isValidString = matrix.match(/(?![01])./g) === null;

    if (isValidString) {
      test.transform(matrix);
    } else {
      console.log("Matrix invalid");
    }
    //
  },
  transform(matrix) {
    //
    let realMatrix = [];
    let arr = Array.from(matrix);
    let row = [];

    for (let cell of arr) {
      if (["0", "1"].includes(cell)) {
        const dataCell = {
          cropped: cell == "0" ? true : false,
          lamp: false,
          illuminated: false,
        };
        row.push(dataCell);
      } else {
        realMatrix.push(row);
        row = [];
      }
    }

    if (row.length > 0) {
      realMatrix.push(row);
      row = [];
    }

    console.log("\n----------BEFORE----------\n");
    test.paint(realMatrix);
    const check = realMatrix.find((e) => e.find((_e) => !_e.cropped));
    if (check) {
      console.log("\n");
      test.start(realMatrix);
    } else {
      console.log("\n----------THE ROOM HAS NO FREE SPACES----------\n");
    }

    //
  },
  paint(matrix) {
    let line = "";
    for (let i = 0; i < matrix.length; i++) {
      const row = matrix[i];
      for (let j = 0; j < row.length; j++) {
        const col = row[j];
        if (col.lamp) {
          line += "L\t";
        } else if (col.illuminated) {
          line += "I\t";
        } else if (col.cropped) {
          line += "C\t";
        } else {
          line += "*\t";
        }
      }
      console.log(line);
      line = "";
    }
  },
  start(matrix) {
    //
    let up = 0;
    let down = 0;
    let left = 0;
    let right = 0;
    let cellsFree = [];
    let rLength = matrix.length;
    let cLength = matrix[0].length;
    let acum = 0;
    let _r = null;
    let _c = null;
    // r = row
    for (let r = 0; r < matrix.length; r++) {
      const row = matrix[r];
      // c = col
      for (let c = 0; c < row.length; c++) {
        const cell = row[c];
        if (!cell.cropped) {
          cellsFree.push({ r, c });
        }
      }
    }

    _r = cellsFree[0].r;
    _c = cellsFree[0].c;

    for (let z = 0; z < cellsFree.length; z++) {
      //
      let _check = cellsFree[z];
      let check = matrix[_check.r][_check.c];
      if (check.lamp) continue;

      for (let x = 0; x < cellsFree.length; x++) {
        //
        let indexs = cellsFree[x];

        for (let index = indexs.r; index >= 0; index--) {
          if (index == indexs.r) continue;
          let cell = matrix[index][indexs.c];
          if (!cell.cropped) up++;
          else break;
          if (cell.illuminated) up--;
        }

        for (let index = indexs.r; index < rLength; index++) {
          if (index == indexs.r) continue;
          let cell = matrix[index][indexs.c];
          if (!cell.cropped) down++;
          else break;
          if (cell.illuminated) down--;
        }

        for (let index = indexs.c; index >= 0; index--) {
          if (index == indexs.c) continue;
          let cell = matrix[indexs.r][index];
          if (!cell.cropped) left++;
          else break;
          if (cell.illuminated) left--;
        }

        for (let index = indexs.c; index < cLength; index++) {
          let cell = matrix[indexs.r][index];
          if (!cell.cropped) right++;
          else break;
          if (cell.illuminated) right--;
        }

        let sum = up + down + left + right;
        if (sum > acum) {
          acum = sum;
          _r = indexs.r;
          _c = indexs.c;
        }
        down = 0;
        left = 0;
        right = 0;
        up = 0;
      }

      matrix[_r][_c].lamp = true;
      acum = 0;

      for (let index = _r; index >= 0; index--) {
        let cell = matrix[index][_c];
        if (!cell.cropped) matrix[index][_c].illuminated = true;
        else break;
      }

      for (let index = _r; index < rLength; index++) {
        let cell = matrix[index][_c];
        if (!cell.cropped) matrix[index][_c].illuminated = true;
        else break;
      }

      for (let index = _c; index >= 0; index--) {
        let cell = matrix[_r][index];
        if (!cell.cropped) matrix[_r][index].illuminated = true;
        else break;
      }

      for (let index = _c; index < cLength; index++) {
        let cell = matrix[_r][index];
        if (!cell.cropped) matrix[_r][index].illuminated = true;
        else break;
      }
    }
    console.log("\n----------AFTER----------\n");
    test.paint(matrix);
  },
});
test.readMatrix();
