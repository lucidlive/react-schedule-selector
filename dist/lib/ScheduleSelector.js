'use strict';

exports.__esModule = true;
exports.preventScroll = exports.GridCell = undefined;

var _react = require('react');

var React = _interopRequireWildcard(_react);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _colors = require('./colors');

var _colors2 = _interopRequireDefault(_colors);

var _selectionSchemes = require('./selection-schemes');

var _selectionSchemes2 = _interopRequireDefault(_selectionSchemes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var formatHour = function formatHour(hour, amPM) {
  var h = hour === 0 || hour === 12 || hour === 24 ? 12 : hour % 12;
  var abb = hour < 12 || hour === 24 ? amPM[0] : amPM[1];
  return '' + h + abb;
};

var Wrapper = _styledComponents2.default.div.withConfig({
  displayName: 'ScheduleSelector__Wrapper',
  componentId: 'sc-10qe3m2-0'
})(['display:flex;align-items:center;width:100%;user-select:none;margin:', ';'], function (props) {
  return props.fontSize;
});

var Grid = _styledComponents2.default.div.withConfig({
  displayName: 'ScheduleSelector__Grid',
  componentId: 'sc-10qe3m2-1'
})(['display:grid;grid-template-columns:auto auto auto auto auto auto auto auto;grid-template-rows:', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ';width:100%;grid-template-columns:repeat(8,1fr);'], function (props) {
  return props.height;
}, function (props) {
  return props.height;
}, function (props) {
  return props.height;
}, function (props) {
  return props.height;
}, function (props) {
  return props.height;
}, function (props) {
  return props.height;
}, function (props) {
  return props.height;
}, function (props) {
  return props.height;
}, function (props) {
  return props.height;
}, function (props) {
  return props.height;
});

var Column = _styledComponents2.default.div.withConfig({
  displayName: 'ScheduleSelector__Column',
  componentId: 'sc-10qe3m2-2'
})(['']);

var GridCell = exports.GridCell = _styledComponents2.default.div.withConfig({
  displayName: 'ScheduleSelector__GridCell',
  componentId: 'sc-10qe3m2-3'
})(['touch-action:none;text-align:center;line-height:', ';'], function (props) {
  return props.height;
});

var DateCell = _styledComponents2.default.div.withConfig({
  displayName: 'ScheduleSelector__DateCell',
  componentId: 'sc-10qe3m2-4'
})(['width:100%;height:', ';line-height:', ';background-color:', ';border:1px #fff solid;&:hover{background-color:', ';}'], function (props) {
  return props.height;
}, function (props) {
  return props.height;
}, function (props) {
  return props.selected ? props.selectedColor : props.unselectedColor;
}, function (props) {
  return props.hoveredColor;
});

var TimeLabelCell = _styledComponents2.default.div.withConfig({
  displayName: 'ScheduleSelector__TimeLabelCell',
  componentId: 'sc-10qe3m2-5'
})(['position:relative;display:block;width:100%;height:', ';line-height:', ';text-align:right;padding-right:8px;'], function (props) {
  return props.height;
}, function (props) {
  return props.height;
});

var preventScroll = exports.preventScroll = function preventScroll(e) {
  e.preventDefault();
};

var ScheduleSelector = function (_React$Component) {
  _inherits(ScheduleSelector, _React$Component);

  function ScheduleSelector(props) {
    _classCallCheck(this, ScheduleSelector);

    // Generate list of dates to render cells for
    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

    _this.renderTimeLabels = function () {
      var labels = []; // Ensures time labels start at correct location
      var count = 0;
      for (var t = _this.props.minTime; t <= _this.props.maxTime; t += 1) {
        labels.push(React.createElement(
          _react.Fragment,
          { key: 'time-' + t },
          React.createElement(
            TimeLabelCell,
            { height: _this.props.cellHeight },
            React.createElement(
              'span',
              null,
              formatHour(t, _this.props.amPM)
            )
          ),
          _this.dates.map(function (dayOfTimes) {
            return _this.renderHourCell(dayOfTimes, count);
          })
        ));
        count++;
      }

      return labels;
    };

    _this.renderHourCell = function (dayOfTimes, t) {
      return React.createElement(
        'div',
        { key: dayOfTimes[t].day },
        _this.renderDateCellWrapper(dayOfTimes[t])
      );
    };

    _this.renderDateColumn = function (item, key) {
      return React.createElement(
        Column,
        { key: item + '-' + key, margin: _this.props.margin },
        React.createElement(
          GridCell,
          { margin: _this.props.margin, height: _this.props.cellHeight },
          React.createElement(
            'span',
            null,
            item
          )
        )
      );
    };

    _this.renderDateCellWrapper = function (time, key) {
      var startHandler = function startHandler() {
        _this.handleSelectionStartEvent(time);
      };

      var selected = Boolean(_this.state.selectionDraft.find(function (a) {
        return a.day === time.day && a.hour === time.hour;
      }));

      return React.createElement(
        GridCell,
        {
          className: 'rgdp__grid-cell',
          role: 'presentation',
          margin: _this.props.margin,
          height: _this.props.cellHeight,
          key: time.day + '-' + time.hour
          // Mouse handlers
          , onMouseDown: startHandler,
          onMouseEnter: function onMouseEnter() {
            _this.handleMouseEnterEvent(time);
          },
          onMouseUp: function onMouseUp() {
            _this.handleMouseUpEvent(time);
          }
          // Touch handlers
          // Since touch events fire on the event where the touch-drag started, there's no point in passing
          // in the time parameter, instead these handlers will do their job using the default SyntheticEvent
          // parameters
          , onTouchStart: startHandler,
          onTouchMove: _this.handleTouchMoveEvent,
          onTouchEnd: _this.handleTouchEndEvent
        },
        _this.renderDateCell(time, selected)
      );
    };

    _this.renderDateCell = function (time, selected) {
      var refSetter = function refSetter(dateCell) {
        _this.cellToDate.set(dateCell, time);
      };
      if (_this.props.renderDateCell) {
        return _this.props.renderDateCell(time, selected, refSetter);
      } else {
        return React.createElement(DateCell, {
          selected: selected,
          innerRef: refSetter,
          height: _this.props.cellHeight,
          selectedColor: _this.props.selectedColor,
          unselectedColor: _this.props.unselectedColor,
          hoveredColor: _this.props.hoveredColor
        });
      }
    };

    _this.dates = [];
    _this.cellToDate = new Map();
    for (var d = 0; d < props.numDays; d += 1) {
      var currentDay = [];
      for (var h = props.minTime; h <= props.maxTime; h += 1) {
        currentDay.push({
          'hour': h,
          'day': d
        });
      }
      _this.dates.push(currentDay);
    }

    _this.state = {
      selectionDraft: [].concat(_this.props.selection), // copy it over
      selectionType: null,
      selectionStart: null,
      isTouchDragging: false
    };

    _this.selectionSchemeHandlers = {
      linear: _selectionSchemes2.default.linear,
      square: _selectionSchemes2.default.square
    };

    _this.endSelection = _this.endSelection.bind(_this);
    _this.handleMouseUpEvent = _this.handleMouseUpEvent.bind(_this);
    _this.handleMouseEnterEvent = _this.handleMouseEnterEvent.bind(_this);
    _this.handleTouchMoveEvent = _this.handleTouchMoveEvent.bind(_this);
    _this.handleTouchEndEvent = _this.handleTouchEndEvent.bind(_this);
    _this.handleSelectionStartEvent = _this.handleSelectionStartEvent.bind(_this);
    return _this;
  }

  ScheduleSelector.prototype.componentDidMount = function componentDidMount() {
    // We need to add the endSelection event listener to the document itself in order
    // to catch the cases where the users ends their mouse-click somewhere besides
    // the date cells (in which case none of the DateCell's onMouseUp handlers would fire)
    //
    // This isn't necessary for touch events since the `touchend` event fires on
    // the element where the touch/drag started so it's always caught.
    document.addEventListener('mouseup', this.endSelection);

    // Prevent page scrolling when user is dragging on the date cells
    this.cellToDate.forEach(function (value, dateCell) {
      if (dateCell && dateCell.addEventListener) {
        dateCell.addEventListener('touchmove', preventScroll, { passive: false });
      }
    });
  };

  ScheduleSelector.prototype.componentWillUnmount = function componentWillUnmount() {
    document.removeEventListener('mouseup', this.endSelection);
    this.cellToDate.forEach(function (value, dateCell) {
      if (dateCell && dateCell.removeEventListener) {
        dateCell.removeEventListener('touchmove', preventScroll);
      }
    });
  };

  ScheduleSelector.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    this.setState({
      selectionDraft: [].concat(nextProps.selection)
    });
  };

  // Performs a lookup into this.cellToDate to retrieve the Date that corresponds to
  // the cell where this touch event is right now. Note that this method will only work
  // if the event is a `touchmove` event since it's the only one that has a `touches` list.


  ScheduleSelector.prototype.getTimeFromTouchEvent = function getTimeFromTouchEvent(event) {
    var touches = event.touches;

    if (!touches || touches.length === 0) return null;
    var _touches$ = touches[0],
        clientX = _touches$.clientX,
        clientY = _touches$.clientY;

    var targetElement = document.elementFromPoint(clientX, clientY);
    var cellTime = this.cellToDate.get(targetElement);
    return cellTime;
  };

  ScheduleSelector.prototype.endSelection = function endSelection() {
    this.props.onChange(this.state.selectionDraft);
    this.setState({
      selectionType: null,
      selectionStart: null
    });
  };

  // Given an ending Date, determines all the dates that should be selected in this draft


  ScheduleSelector.prototype.updateAvailabilityDraft = function updateAvailabilityDraft(selectionEnd, callback) {
    var _state = this.state,
        selectionType = _state.selectionType,
        selectionStart = _state.selectionStart;


    if (selectionType === null || selectionStart === null) return;

    var newSelection = [];
    if (selectionStart && selectionEnd && selectionType) {
      newSelection = this.selectionSchemeHandlers[this.props.selectionScheme](selectionStart, selectionEnd, this.dates);
    }

    var nextDraft = [].concat(this.props.selection);
    if (selectionType === 'add') {
      nextDraft = Array.from(new Set([].concat(nextDraft, newSelection)));
    } else if (selectionType === 'remove') {
      nextDraft = nextDraft.filter(function (a) {
        return !newSelection.find(function (b) {
          return a.hour === b.hour && a.day === b.day;
        });
      });
    }

    this.setState({ selectionDraft: nextDraft }, callback);
  };

  // Isomorphic (mouse and touch) handler since starting a selection works the same way for both classes of user input


  ScheduleSelector.prototype.handleSelectionStartEvent = function handleSelectionStartEvent(selectionStart) {
    // Check if the startTime cell is selected/unselected to determine if this drag-select should
    // add values or remove values
    var timeSelected = this.props.selection.find(function (a) {
      return a.hour === selectionStart.hour && a.day === selectionStart.day;
    });
    var selectionType = timeSelected ? 'remove' : 'add';

    this.setState({
      selectionType: selectionType,
      selectionStart: selectionStart
    });
  };

  ScheduleSelector.prototype.handleMouseEnterEvent = function handleMouseEnterEvent(time) {
    // Need to update selection draft on mouseup as well in order to catch the cases
    // where the user just clicks on a single cell (because no mouseenter events fire
    // in this scenario)
    this.updateAvailabilityDraft(time);
  };

  ScheduleSelector.prototype.handleMouseUpEvent = function handleMouseUpEvent(time) {
    this.updateAvailabilityDraft(time);
    // Don't call this.endSelection() here because the document mouseup handler will do it
  };

  ScheduleSelector.prototype.handleTouchMoveEvent = function handleTouchMoveEvent(event) {
    this.setState({ isTouchDragging: true });
    var cellTime = this.getTimeFromTouchEvent(event);
    if (cellTime) {
      this.updateAvailabilityDraft(cellTime);
    }
  };

  ScheduleSelector.prototype.handleTouchEndEvent = function handleTouchEndEvent() {
    var _this2 = this;

    if (!this.state.isTouchDragging) {
      // Going down this branch means the user tapped but didn't drag -- which
      // means the availability draft hasn't yet been updated (since
      // handleTouchMoveEvent was never called) so we need to do it now
      this.updateAvailabilityDraft(null, function () {
        _this2.endSelection();
      });
    } else {
      this.endSelection();
    }
    this.setState({ isTouchDragging: false });
  };

  ScheduleSelector.prototype.render = function render() {
    var _this3 = this;

    return React.createElement(
      Wrapper,
      null,
      React.createElement(
        Grid,
        {
          innerRef: function innerRef(el) {
            _this3.gridRef = el;
          },
          height: this.props.cellHeight
        },
        React.createElement('div', null),
        this.props.daysOfWeek.map(this.renderDateColumn),
        this.renderTimeLabels()
      )
    );
  };

  return ScheduleSelector;
}(React.Component);

ScheduleSelector.defaultProps = {
  selection: [],
  selectionScheme: 'square',
  numDays: 7,
  minTime: 9,
  maxTime: 23,
  startDate: new Date(),
  dateFormat: 'M/D',
  margin: 3,
  cellHeight: '55px',
  selectedColor: _colors2.default.blue,
  unselectedColor: _colors2.default.paleBlue,
  hoveredColor: _colors2.default.lightBlue,
  onChange: function onChange() {},
  amPM: ['am', 'pm'],
  daysOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
};
exports.default = ScheduleSelector;