(function (echarts) {

  'use strict';

  function Wrap(title, fn) {
    var log = function (message, data) {
      console.log('[' + title + '] ' + message, data);
    };
    return function () {
      log('called with', arguments);
      if (typeof fn === 'function') {
        var ret;
        try {
          ret = fn.apply(null, arguments);
          log('returns', ret);
          return ret;
        } catch (e) {
          log('throws', e);
        }
      }
    };
  }

  function toPercent(value, lower, upper) {
    if (lower === undefined) { lower = 0; }
    if (upper === undefined) { lower = 1; }
    return (value - lower) / (upper - lower);
  }

  function splitColor(text) {
    var v = parseInt(text.substring(1), 16);
    var b = v % 256;
    v = (v - b) / 256;
    var g = v % 256;
    return [(v - g) / 256, g, b];
  }

  function padding(s, length) {
    return '0'.repeat(length - s.length) + s;
  }

  function intToColor(v) {
    return '#' + padding(v.toString(16), 6);
  }

  function joinColor(c) {
    return intToColor((c[0] * 256 + c[1]) * 256 + c[2]);
  }

  function mixInt(percent, l, u) {
    return Math.ceil((u - l) * percent + l);
  }

  function mixColor(percent, cl, cu) {
    return cl.map(function (l, i) { return mixInt(percent, l, cu[i]); });
  }

  function mix(value, colorFrom, colorTo, lower, upper) {
    return joinColor(mixColor(toPercent(value, lower, upper), splitColor(colorFrom), splitColor(colorTo)));
  }

  echarts.init(document.getElementById('main')).setOption({
    backgroundColor: '#a6a6a6',
    title: {
      show: false,
      text: 'MCM-ICM F Route Preview',
      subtext: 'Only European-targeted data included.',
      x: 'center'
    },
    tooltip: {trigger: 'item', formatter: '{b}'},
    toolbox: {show: false},
    dataRange: {
      min: -220000,
      max: 210000,
      text:['High In', 'High Out'],
      realtime: false,
      calculable : true,
      color: ['red', 'green', 'blue']
    },
    series: [{
      type: 'map',
      mapType: 'world',
      mapLocation: {x: '-80%', width: '250%', y: '-40%', height: '250%'},
      roam: true,
      itemStyle: {
        normal: {
          borderColor: '#494949',
          borderWidth: 0.5,
          areaStyle: {
            color: '#e2e2e2'
          }
        }
      },
      data: [
        // 中东
        {name: 'Syria', value: -220000},
        {name: 'Iraq', value: -220000},
        // 中非
        {name: 'Sudan', value: -220000},
        // 西非
        {name: 'Mali', value: -48000},
        {name: 'Western Sahara', value: -48000},
        // 欧洲各国
        {name: 'France', value: 108100},
        {name: 'Germany', value: 210000},
        {name: 'Italy', value: 93000},
        {name: 'Austria', value: 60700},
        {name: 'Greece', value: 7300},
        {name: 'Spain', value: 5800}
      ],
      geoCoord: {
        '中东':	[38.8, 33.4],
        '土耳其': [31.5, 37.7],
        '希腊': [21.7, 39.4],
        '奥地利':	[16.4, 48.2],
        '德国':	[10.3, 48.3],
        '北非': [9.9, 33.9],
        '意大利': [12.5, 42.1],
        '法国': [4.9, 46,3],
        '西非口岸': [-4.9, 32.7],
        '西班牙': [-4, 38],
        '中非': [30.2, 15.2],
        '西非': [-6, 22.3]
      },
      markLine: {
        smooth: true,
        effect: {
          show: true,
          scaleSize: 1,
          period: 30,
          color: '#fff',
          shadowBlur: 10
        },
        itemStyle: {
          normal: {
            color: function (line) {
              return mix(0.2 + 0.6 * Math.sqrt(toPercent(line.data[1].value, 4000, 253000)), '#00ff00', '#ff0000');
            },
            borderWidth: 4,
            lineStyle: {type: 'solid', shadowBlur: 10},
            label: {show: false}
          }
        },
        data: [
          [{name: '中东'}, {name: '土耳其', value: 197000}],
          [{name: '土耳其'}, {name: '希腊', value: 198000}],
          [{name: '希腊'}, {name: '奥地利', value: 190700}],
          [{name: '奥地利'}, {name: '德国', value: 130000}],
          [{name: '中东'}, {name: '北非', value: 100000}],
          [{name: '北非'}, {name: '意大利', value: 253000}],
          [{name: '意大利'}, {name: '法国', value: 160000}],
          [{name: '法国'}, {name: '德国', value: 80000}],
          [{name: '西非口岸'}, {name: '西班牙', value: 33900}],
          [{name: '西班牙'}, {name: '法国', value: 28100}],
          [{name: '中非'}, {name: '中东', value: 70000}],
          [{name: '中非'}, {name: '北非', value: 120000}],
          [{name: '中非'}, {name: '西非口岸', value: 30000}],
          [{name: '西非'}, {name: '北非', value: 44000}],
          [{name: '北非'}, {name: '中东', value: 7000}],
          [{name: '西非'}, {name: '西非口岸', value: 4000}]
        ]
      },
      markPoint: {
        symbol: 'circle',
        symbolSize: function (v) { return 10 + v / 40000; },
        effect: {show: true},
        itemStyle: {
          normal: {
            color: function (point) {
              return mix(point.data.value, '#00ff00', '#ff0000', 48000, 524000);
            },
            label: {show: true}
          }
        },
        data: [
          {name: '中东', value: 374000},
          {name: '土耳其', value: 395000},
          {name: '希腊', value: 388700},
          {name: '奥地利', value: 320700},
          {name: '德国', value: 210000},
          {name: '北非', value: 524000},
          {name: '意大利', value: 413000},
          {name: '法国', value: 268100},
          {name: '西非口岸', value: 67900},
          {name: '西班牙', value: 62000},
          {name: '中非', value: 220000},
          {name: '西非', value: 48000}
        ]
      }
    }]
  });
})(window.echarts);
