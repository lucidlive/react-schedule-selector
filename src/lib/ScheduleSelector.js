// @flow
import * as React from 'react'
import { Fragment } from 'react';
import styled from 'styled-components'
import colors from './colors'
import selectionSchemes from './selection-schemes'

const formatHour = (hour: number, amPM:Array): string => {
  const h = hour === 0 || hour === 12 || hour === 24 ? 12 : hour % 12
  const abb = hour < 12 || hour === 24 ? amPM[0] : amPM[1]
  return `${h} ${abb}`
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  user-select: none;
  box-sizing: border-box;
`

const Grid = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(8, 1fr);
  box-sizing: border-box;
`

const Column = styled.div`
`

export const GridCell = styled.div`
  touch-action: none;
  text-align:center;
  line-height: ${props => props.height};
  box-sizing: border-box;
`

export const GridHeader = styled.div`
  touch-action: none;
  text-align:center;
  line-height: ${props => props.height};
  background: ${props => props.backgroundColor};
  color: ${props => props.color};
  box-sizing: border-box;
  margin-bottom:10px;
`

const DateCell = styled.div`
  height: ${props => props.height};
  line-height: ${props => props.height};
  background-color: ${props => (props.selected ? props.selectedColor : props.unselectedColor)};
  box-sizing: border-box;
  margin: ${props => props.margin};

  &:hover {
    background-color: ${props => props.hoveredColor};
  }
`

const TimeLabelCell = styled.div`
  position: relative;
  display: block;
  width: 100%;
  height: ${props => props.height};
  line-height: ${props => props.height};
  text-align: left;
  box-sizing: border-box;
`

type PropsType = {
  selection: Array<Date>,
  selectionScheme: SelectionSchemeType,
  onChange: (Array<Date>) => void,
  startDate: Date,
  numDays: number,
  minTime: number,
  maxTime: number,
  dateFormat: string,
  margin: number,
  unselectedColor: string,
  selectedColor: string,
  hoveredColor: string,
  cellHeight: string,
  daysOfWeek:Array,
  amPM:Array,
  renderDateCell?: (Date, boolean, (HTMLElement) => void) => React.Node
}

type StateType = {
  // In the case that a user is drag-selecting, we don't want to call this.props.onChange() until they have completed
  // the drag-select. selectionDraft serves as a temporary copy during drag-selects.
  selectionDraft: Array<Date>,
  selectionType: ?SelectionType,
  selectionStart: ?Date,
  isTouchDragging: boolean
}

export const preventScroll = (e: TouchEvent) => {
  e.preventDefault()
}

export default class ScheduleSelector extends React.Component<PropsType, StateType> {
  dates: Array<Array<Date>>
  selectionSchemeHandlers: { [string]: (Date, Date, Array<Array<Date>>) => Date[] }
  cellToDate: Map<HTMLElement, Date>
  documentMouseUpHandler: () => void
  endSelection: () => void
  handleTouchMoveEvent: (SyntheticTouchEvent<*>) => void
  handleTouchEndEvent: () => void
  handleMouseUpEvent: Date => void
  handleMouseEnterEvent: Date => void
  handleSelectionStartEvent: Date => void
  gridRef: ?HTMLElement

  static defaultProps = {
    selection: [],
    selectionScheme: 'square',
    numDays: 7,
    minTime: 0,
    maxTime: 23,
    startDate: new Date(),
    dateFormat: 'M/D',
    margin: '5px',
    cellHeight: '20px',
    lineColor: '#eee',
    rootCellColor: '#000',
    times: [
      "morning",
      "afternoon",
      "evening",
      "night"
    ],
    rootCellBackgroundColor: '#fff',
    headerBackgroundColor: '#fff',
    selectedColor: colors.blue,
    unselectedColor: colors.paleBlue,
    hoveredColor: colors.lightBlue,
    onChange: () => {},
    amPM:['am','pm'],
    daysOfWeek: [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday'
    ]
  }

  constructor(props: PropsType) {
    super(props)
    // Generate list of dates to render cells for
    this.dates = []
    this.cellToDate = new Map()
    for (let d = 0; d < props.numDays; d += 1) {
      const currentDay = []
      for (let h = 0; h < this.props.times.length; h++) {
        currentDay.push({
          'position': h,
          'day': d,
          });
      }
      this.dates.push(currentDay);
    }

    this.state = {
      selectionDraft: [...this.props.selection], // copy it over
      selectionType: null,
      selectionStart: null,
      isTouchDragging: false
    }

    this.selectionSchemeHandlers = {
      linear: selectionSchemes.linear,
      square: selectionSchemes.square
    }

    this.endSelection = this.endSelection.bind(this)
    this.handleMouseUpEvent = this.handleMouseUpEvent.bind(this)
    this.handleMouseEnterEvent = this.handleMouseEnterEvent.bind(this)
    this.handleTouchMoveEvent = this.handleTouchMoveEvent.bind(this)
    this.handleTouchEndEvent = this.handleTouchEndEvent.bind(this)
    this.handleSelectionStartEvent = this.handleSelectionStartEvent.bind(this)
  }

  componentDidMount() {
    // We need to add the endSelection event listener to the document itself in order
    // to catch the cases where the users ends their mouse-click somewhere besides
    // the date cells (in which case none of the DateCell's onMouseUp handlers would fire)
    //
    // This isn't necessary for touch events since the `touchend` event fires on
    // the element where the touch/drag started so it's always caught.
    document.addEventListener('mouseup', this.endSelection)

    // Prevent page scrolling when user is dragging on the date cells
    this.cellToDate.forEach((value, dateCell) => {
      if (dateCell && dateCell.addEventListener) {
        dateCell.addEventListener('touchmove', preventScroll, { passive: false })
      }
    })
  }

  componentWillUnmount() {
    document.removeEventListener('mouseup', this.endSelection)
    this.cellToDate.forEach((value, dateCell) => {
      if (dateCell && dateCell.removeEventListener) {
        dateCell.removeEventListener('touchmove', preventScroll)
      }
    })
  }

  componentWillReceiveProps(nextProps: PropsType) {
    this.setState({
      selectionDraft: [...nextProps.selection]
    })
  }

  // Performs a lookup into this.cellToDate to retrieve the Date that corresponds to
  // the cell where this touch event is right now. Note that this method will only work
  // if the event is a `touchmove` event since it's the only one that has a `touches` list.
  getTimeFromTouchEvent(event: SyntheticTouchEvent<*>): ?Date {
    const { touches } = event
    if (!touches || touches.length === 0) return null
    const { clientX, clientY } = touches[0]
    const targetElement = document.elementFromPoint(clientX, clientY)
    const cellTime = this.cellToDate.get(targetElement)
    return cellTime
  }

  endSelection() {
    this.props.onChange(this.state.selectionDraft)
    this.setState({
      selectionType: null,
      selectionStart: null
    })
  }

  // Given an ending Date, determines all the dates that should be selected in this draft
  updateAvailabilityDraft(selectionEnd: ?Date, callback?: () => void) {
    const { selectionType, selectionStart } = this.state

    if (selectionType === null || selectionStart === null) return

    let newSelection = []
    if (selectionStart && selectionEnd && selectionType) {
      newSelection = this.selectionSchemeHandlers[this.props.selectionScheme](selectionStart, selectionEnd, this.dates)
    }

    let nextDraft = [...this.props.selection]
    if (selectionType === 'add') {
      nextDraft = Array.from(new Set([...nextDraft, ...newSelection]))

    } else if (selectionType === 'remove') {
      nextDraft = nextDraft.filter(a => !newSelection.find(b => a.position === b.position && a.day === b.day))
    }

    this.setState({ selectionDraft: nextDraft }, callback)
  }

  // Isomorphic (mouse and touch) handler since starting a selection works the same way for both classes of user input
  handleSelectionStartEvent(selectionStart) {
    // Check if the startTime cell is selected/unselected to determine if this drag-select should
    // add values or remove values
    const timeSelected = this.props.selection.find(a => a.position === selectionStart.position && a.day === selectionStart.day);
    const selectionType =  timeSelected ? 'remove' : 'add';

    this.setState({
      selectionType,
      selectionStart
    })
  }

  handleMouseEnterEvent(time) {
    // Need to update selection draft on mouseup as well in order to catch the cases
    // where the user just clicks on a single cell (because no mouseenter events fire
    // in this scenario)
    this.updateAvailabilityDraft(time)
  }

  handleMouseUpEvent(time) {
    this.updateAvailabilityDraft(time)
    // Don't call this.endSelection() here because the document mouseup handler will do it
  }

  handleTouchMoveEvent(event: SyntheticTouchEvent<*>) {
    this.setState({ isTouchDragging: true })
    const cellTime = this.getTimeFromTouchEvent(event)
    if (cellTime) {
      this.updateAvailabilityDraft(cellTime)
    }
  }

  handleTouchEndEvent() {
    if (!this.state.isTouchDragging) {
      // Going down this branch means the user tapped but didn't drag -- which
      // means the availability draft hasn't yet been updated (since
      // handleTouchMoveEvent was never called) so we need to do it now
      this.updateAvailabilityDraft(null, () => {
        this.endSelection()
      })
    } else {
      this.endSelection()
    }
    this.setState({ isTouchDragging: false })
  }

  renderTimeLabels = (): React.Element<*> => {
    const labels = [] // Ensures time labels start at correct location
    let count=0;
    for (let t = 0; t < this.props.times.length; t += 1) {
      labels.push(
        <Fragment key={`time-${t}`}>
          <TimeLabelCell height={this.props.cellHeight} lineColor={this.props.lineColor}>
            <span>{this.props.times[t]}</span>
          </TimeLabelCell>
          {this.dates.map((dayOfTimes) => this.renderHourCell(dayOfTimes, count))}
        </Fragment>
      )
      count++;
    }

    return labels;
  }

  renderHourCell = (dayOfTimes: Array<Date>, t) => this.renderDateCellWrapper(dayOfTimes[t]);

  renderDateColumn = (item, key) => (
    <GridHeader
      key={`${item}-${key}`}
      margin={this.props.margin}
      height={this.props.cellHeight}
      lineColor={this.props.lineColor}
      backgroundColor={this.props.headerBackgroundColor}>
      <span>{item}</span>
    </GridHeader>
  );

  renderDateCellWrapper = (time, key): React.Element<*> => {
    const startHandler = () => {
      this.handleSelectionStartEvent(time)
    }

    const selected = Boolean(this.state.selectionDraft.find(a => a.day === time.day && a.position === time.position));

    return (
      <GridCell
        className="rgdp__grid-cell"
        role="presentation"
        margin={this.props.margin}
        height={this.props.cellHeight}
        key={`${time.day}-${time.position}`}
        // Mouse handlers
        onMouseDown={startHandler}
        onMouseEnter={() => {
          this.handleMouseEnterEvent(time)
        }}
        onMouseUp={() => {
          this.handleMouseUpEvent(time)
        }}
        // Touch handlers
        // Since touch events fire on the event where the touch-drag started, there's no point in passing
        // in the time parameter, instead these handlers will do their job using the default SyntheticEvent
        // parameters
        onTouchStart={startHandler}
        onTouchMove={this.handleTouchMoveEvent}
        onTouchEnd={this.handleTouchEndEvent}
      >
        {this.renderDateCell(time, selected)}
      </GridCell>
    )
  }

  renderDateCell = (time, selected: boolean): React.Node => {
    const refSetter = (dateCell: HTMLElement) => {
      this.cellToDate.set(dateCell, time)
    }
    if (this.props.renderDateCell) {
      return this.props.renderDateCell(time, selected, refSetter)
    } else {
      return (
        <DateCell
          selected={selected}
          innerRef={refSetter}
          lineColor={this.props.lineColor}
          margin={this.props.margin}
          height={this.props.cellHeight}
          selectedColor={this.props.selectedColor}
          unselectedColor={this.props.unselectedColor}
          hoveredColor={this.props.hoveredColor}
        />
      )
    }
  }

  render(): React.Element<*> {
    return (
      <Wrapper>
        {
          <Grid
            innerRef={el => {
              this.gridRef = el
            }}
            height={this.props.cellHeight}
          >
            <GridHeader
              lineColor={this.props.lineColor}
              height={this.props.cellHeight}
              color={this.props.rootCellColor}
              backgroundColor={this.props.rootCellBackgroundColor}
              >
              {this.props.timeLabel}
            </GridHeader>
            {this.props.daysOfWeek.map(this.renderDateColumn)}
            {/* this.dates.map(this.renderDateColumn) */}
            { this.renderTimeLabels()}
          {/* this.renderTimeLabels() */}
          </Grid>
        }
      </Wrapper>
    )
  }
}
