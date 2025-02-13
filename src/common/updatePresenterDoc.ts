import { EnvironmentTagBlock } from '@universal-packages/logger-terminal-presenter'
import { Color } from '@universal-packages/terminal-document'
import { LoadingBlock, PresenterRowDescriptor } from '@universal-packages/terminal-presenter'
import { Measurement } from '@universal-packages/time-measurer'

import { LOG_CONFIGURATION } from './LOG_CONFIGURATION'

const ACTIVE_HANDLERS: Record<string, number> = {}
const REQUEST_COUNTS: Record<string, { count: number; slower: Measurement }> = {}

export function updatePresenterDoc() {
  if (!core.terminalPresenter.OPTIONS.enabled) return

  const primaryColor = LOG_CONFIGURATION.categoryBackgroundColor as Color
  const documentRows: PresenterRowDescriptor[] = []

  documentRows.push({ blocks: [{ text: ' ' }] })

  const headerRow: PresenterRowDescriptor = {
    border: [true, false, false, false],
    borderStyle: 'double',
    borderColor: primaryColor,
    blocks: []
  }

  headerRow.blocks.push(LoadingBlock({ style: 'star' }))
  headerRow.blocks.push({ text: ' ', width: 'fit' })

  headerRow.blocks.push({
    color: primaryColor,
    style: 'bold',
    text: 'Express Controllers',
    width: 'fit'
  })
  headerRow.blocks.push({ text: ' ', width: 'fit' })

  headerRow.blocks.push({ text: ' ' })

  headerRow.blocks.push({ backgroundColor: primaryColor, style: 'bold', text: ' EXPRESS ', width: 'fit' })
  headerRow.blocks.push({ text: ' ', width: 'fit' })
  headerRow.blocks.push(EnvironmentTagBlock())

  documentRows.push(headerRow)

  // MIDDLE ROW ===============================================================
  documentRows.push({ blocks: [{ text: ' ' }] })

  const middleRow: PresenterRowDescriptor = { blocks: [] }

  // STATS ===============================================================

  const statsRow1: PresenterRowDescriptor = {
    border: [true, false, true, false],
    borderStyle: ['double', 'double', 'double', 'double'],
    borderColor: primaryColor,
    blocks: []
  }

  const slowerHandler = Object.entries(REQUEST_COUNTS).reduce(
    (acc, curr) => {
      if (!acc[1].slower) {
        return curr
      }

      if (!curr[1].slower) {
        return acc
      }

      if (acc[1].slower.toDate() < curr[1].slower.toDate()) {
        return curr
      }

      return acc
    },
    ['', { count: 0, slower: undefined }]
  )

  statsRow1.blocks.push({
    border: [false, true, false, false],
    borderStyle: ['dash-4', 'dash-4', 'double', 'dash-4'],
    borderColor: primaryColor,
    text: ` Slowest: ${slowerHandler[0]} (${slowerHandler[1].slower?.toString()}) `
  })

  const fastestHandler = Object.entries(REQUEST_COUNTS).reduce(
    (acc, curr) => {
      if (!acc[1].slower) {
        return curr
      }

      if (!curr[1].slower) {
        return acc
      }

      if (acc[1].slower.toDate() > curr[1].slower.toDate()) {
        return curr
      }

      return acc
    },
    ['', { count: 0, slower: undefined }]
  )

  statsRow1.blocks.push({
    border: [false, false, false, false],
    borderStyle: ['dash-4', 'dash-4', 'double', 'dash-4'],
    borderColor: primaryColor,
    text: ` Fastest: ${fastestHandler[0]} (${fastestHandler[1].slower?.toString()}) `
  })

  documentRows.push(statsRow1)

  const statsRow2: PresenterRowDescriptor = {
    border: [true, false, true, false],
    borderStyle: ['dash-4', 'double', 'double', 'double'],
    borderColor: primaryColor,
    blocks: []
  }

  statsRow2.blocks.push({
    border: [false, true, false, false],
    borderStyle: ['dash-4', 'dash-4', 'double', 'dash-4'],
    borderColor: primaryColor,
    text: ` Active Handlers: ${Object.values(ACTIVE_HANDLERS).reduce((acc, curr) => acc + (curr > 0 ? 1 : 0), 0)} `
  })

  statsRow2.blocks.push({
    border: [false, true, false, false],
    borderStyle: ['dash-4', 'dash-4', 'double', 'dash-4'],
    borderColor: primaryColor,
    text: ` Active Requests: ${Object.values(ACTIVE_HANDLERS).reduce((acc, curr) => acc + curr, 0)} `
  })

  const topHandler = Object.entries(REQUEST_COUNTS).reduce(
    (acc, curr) => {
      if ((acc[1] as any) < curr[1].count) {
        return [curr[0], curr[1].count]
      }

      return acc
    },
    ['', 0]
  )

  statsRow2.blocks.push({
    border: [false, true, false, false],
    borderStyle: ['dash-4', 'dash-4', 'double', 'dash-4'],
    borderColor: primaryColor,
    text: ` Top: ${topHandler[0]} (${topHandler[1]}) `
  })

  statsRow2.blocks.push({
    align: 'right',
    border: [false, false, false, false],
    borderStyle: ['dash-4', 'dash-4', 'double', 'dash-4'],
    borderColor: primaryColor,
    text: ` Request Count: ${Object.values(REQUEST_COUNTS).reduce((acc, curr) => acc + curr.count, 0)} `
  })

  documentRows.push(statsRow2)

  core.terminalPresenter.updateRealTimeDocument('EXPRESS-DOC', { rows: documentRows })
}

export function setRequestHandling(handler: string) {
  if (!ACTIVE_HANDLERS[handler]) ACTIVE_HANDLERS[handler] = 0
  if (!REQUEST_COUNTS[handler]) REQUEST_COUNTS[handler] = { count: 0, slower: undefined }

  ACTIVE_HANDLERS[handler]++
  REQUEST_COUNTS[handler].count++

  updatePresenterDoc()
}

export function setRequestHandled(handler: string, measurement: Measurement) {
  if (!ACTIVE_HANDLERS[handler] || !REQUEST_COUNTS[handler]) return

  ACTIVE_HANDLERS[handler]--

  if (!REQUEST_COUNTS[handler].slower) {
    REQUEST_COUNTS[handler].slower = measurement
  } else {
    const slowerAsDate = REQUEST_COUNTS[handler].slower.toDate()
    const measurementAsDate = measurement.toDate()

    if (slowerAsDate < measurementAsDate) {
      REQUEST_COUNTS[handler].slower = measurement
    }
  }

  updatePresenterDoc()
}
