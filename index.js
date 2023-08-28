/**
Copyright 2015 Natural Atlas, Inc.
Copyright 2023 easrng <https://easrng.net>
SPDX-License-Identifier: Apache-2.0
*/
const svgNS = "http://www.w3.org/2000/svg";
class ImageGrid extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    const style = document.createElement("style");
    style.textContent = ":host{display:flex}";
    const style2 = document.createElement("style");
    const slot = document.createElement("slot");
    slot.name = "extra";
    const svg = document.createElementNS(svgNS, "svg");
    // @ts-ignore
    this.shadowRoot.textContent = "";
    // @ts-ignore
    this.shadowRoot.append(style, style2, slot, svg);
    const update = () => {
      const elements = [];
      let i = 0;
      for (const child of this.children) {
        if (child.slot === "extra") continue;
        child.slot = "" + i++;
        elements.push({
          width: parseInt("" + child.getAttribute("data-width")),
          height: parseInt("" + child.getAttribute("data-height")),
        });
      }
      let n,
        height,
        positions = [],
        elementCount;
      const spacing = 4;
      let containerWidth = 512;
      const idealHeight = containerWidth / 2;
      if (!containerWidth) throw new Error("Invalid container width");
      // calculate aspect ratio of all photos
      let aspect;
      let aspects = [];
      let aspects100 = [];
      let ySum = 0;
      for (i = 0, n = elements.length; i < n; i++) {
        aspect = elements[i].width / elements[i].height;
        aspects.push(aspect);
        aspects100.push(Math.round(aspect * 100));
      }
      // calculate total width of all photos
      let summedWidth = 0;
      for (i = 0, n = aspects.length; i < n; i++) {
        summedWidth += aspects[i] * idealHeight;
      }
      // calculate rows needed
      let rowsNeeded = Math.round(summedWidth / containerWidth);
      // adjust photo sizes
      if (rowsNeeded < 1) {
        // (2a) Fallback to just standard size
        let xSum = 0,
          width;
        elementCount = elements.length;
        let padLeft = 0;
        for (i = 0; i < elementCount; i++) {
          width =
            Math.round(idealHeight * aspects[i]) -
            (spacing * (elementCount - 1)) / elementCount;
          positions.push({
            y: 0,
            x: padLeft + xSum,
            width: width,
            height: idealHeight,
          });
          xSum += width;
          if (i !== n - 1) {
            xSum += spacing;
          }
        }
        ySum = idealHeight;
        containerWidth = xSum;
      } else {
        // (2b) Distribute photos over rows using the aspect ratio as weight
        let partitions = (() => {
          {
            let partitions = [];
            let k = rowsNeeded;
            let i, j, m, n, solution, table, x, _i, _j, _k, _l;
            let _m, _nn;
            n = aspects100.length;
            if (k <= 0) {
              return [];
            }
            if (k > n) {
              return aspects100.map((x) => [x]);
            }
            {
              let _i, _results;
              _results = [];
              for (_i = 0; 0 <= n ? _i < n : _i > n; 0 <= n ? ++_i : --_i) {
                let _j, _results1;
                _results1 = [];
                for (
                  x = _j = 0;
                  0 <= k ? _j < k : _j > k;
                  x = 0 <= k ? ++_j : --_j
                ) {
                  _results1.push(0);
                }
                _results.push(_results1);
              }
              table = _results;
            }
            {
              let _i, _ref, _results;
              _results = [];
              for (
                _i = 0, _ref = n - 1;
                0 <= _ref ? _i < _ref : _i > _ref;
                0 <= _ref ? ++_i : --_i
              ) {
                let _j, _ref1, _results1;
                _results1 = [];
                for (
                  x = _j = 0, _ref1 = k - 1;
                  0 <= _ref1 ? _j < _ref1 : _j > _ref1;
                  x = 0 <= _ref1 ? ++_j : --_j
                ) {
                  _results1.push(0);
                }
                _results.push(_results1);
              }
              solution = _results;
            }
            for (
              i = _i = 0;
              0 <= n ? _i < n : _i > n;
              i = 0 <= n ? ++_i : --_i
            ) {
              table[i][0] = aspects100[i] + (i ? table[i - 1][0] : 0);
            }
            for (
              j = _j = 0;
              0 <= k ? _j < k : _j > k;
              j = 0 <= k ? ++_j : --_j
            ) {
              table[0][j] = aspects100[0];
            }
            for (
              i = _k = 1;
              1 <= n ? _k < n : _k > n;
              i = 1 <= n ? ++_k : --_k
            ) {
              for (
                j = _l = 1;
                1 <= k ? _l < k : _l > k;
                j = 1 <= k ? ++_l : --_l
              ) {
                m = [];
                for (
                  x = _m = 0;
                  0 <= i ? _m < i : _m > i;
                  x = 0 <= i ? ++_m : --_m
                ) {
                  m.push([
                    Math.max(table[x][j - 1], table[i][0] - table[x][0]),
                    x,
                  ]);
                }
                let minValue = 0,
                  minIndex = 0;
                for (_m = 0, _nn = m.length; _m < _nn; _m++) {
                  if (_m === 0 || m[_m][0] < minValue) {
                    minValue = m[_m][0];
                    minIndex = _m;
                  }
                }
                m = m[minIndex];
                table[i][j] = m[0];
                solution[i - 1][j - 1] = m[1];
              }
            }
            n = n - 1;
            k = k - 2;
            while (k >= 0) {
              let _m, _ref, _ref1, _results;
              _results = [];
              for (
                i = _m = _ref = solution[n - 1][k] + 1, _ref1 = n + 1;
                _ref <= _ref1 ? _m < _ref1 : _m > _ref1;
                i = _ref <= _ref1 ? ++_m : --_m
              ) {
                _results.push(aspects100[i]);
              }
              partitions.unshift(_results);
              n = solution[n - 1][k];
              k = k - 1;
              if (n === 0) break;
            }
            let _ref, _results;
            _results = [];
            for (
              i = _m = 0, _ref = n + 1;
              0 <= _ref ? _m < _ref : _m > _ref;
              i = 0 <= _ref ? ++_m : --_m
            ) {
              _results.push(aspects100[i]);
            }
            partitions.unshift(_results);
            return partitions;
          }
        })();
        let index = 0;
        let xSum = 0,
          width;
        for (let i = 0; i < partitions.length; i++) {
          const partition = partitions[i];
          let element_index = index;
          let summedRatios = 0;
          for (let j = 0, k = partition.length; j < k; j++) {
            summedRatios += aspects[element_index + j];
            index++;
          }
          xSum = 0;
          height = Math.round(containerWidth / summedRatios);
          elementCount = partition.length;
          for (let j = 0; j < elementCount; j++) {
            width = Math.round(
              ((containerWidth - (elementCount - 1) * spacing) / summedRatios) *
                aspects[element_index + j]
            );
            positions.push({
              y: ySum,
              x: xSum,
              width: width,
              height: height,
            });
            xSum += width;
            if (j !== elementCount - 1) {
              xSum += spacing;
            }
          }
          ySum += height;
          if (i !== partitions.length - 1) {
            ySum += spacing;
          }
        }
      }
      style2.textContent = `:host{aspect-ratio:${containerWidth}/${ySum}}`;
      svg.setAttribute("viewBox", `0 0 ${containerWidth} ${ySum}`);
      svg.textContent = "";
      svg.append(
        ...positions.map((pos, i) => {
          const fo = document.createElementNS(svgNS, "foreignObject");
          fo.setAttribute("x", "" + pos.x);
          fo.setAttribute("y", "" + pos.y);
          fo.setAttribute("width", "" + pos.width);
          fo.setAttribute("height", "" + pos.height);
          const slot = document.createElement("slot");
          slot.name = "" + i;
          fo.append(slot);
          return fo;
        })
      );
    };
    update();
    new MutationObserver(update).observe(this, {
      childList: true,
      attributes: true,
    });
  }
}
customElements.define("easrng-image-grid", ImageGrid);
