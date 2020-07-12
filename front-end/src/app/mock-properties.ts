import { Property } from './property'

export const PROPERTIES: Property[] = [
  new Property({
    id: 'TDF900576',
    address: '309-311 William St West Melbourne VIC 3003',
    owner: 'Daniel Scott',
    type: 'Owned',
    termLimitation: 1,
    coodinates: [
      [-37.80871496731086, 144.95489774803355],
      [-37.80930831595679, 144.9526017771168],
      [-37.812376700013466, 144.95401798347666],
      [-37.81178337602438, 144.95635686973765]
    ]
  }), 
  new Property({
    id: 'TDF100524',
    address: 'Charisma Workshop | Specialty Coffee, Teas & Pastries',
    owner: 'David Jones',
    type: 'Owned',
    termLimitation: 2,
    coodinates: [
      [-37.8086784747861, 144.9553989745773],
      [-37.811886050589756, 144.95671391487122],
      [-37.811009461048286, 144.95884293095241],
      [-37.80815293317267, 144.95742672459255]
    ]
  }), 
  new Property({
    id: 'TDF089390',
    address: 'Brights Pl Melbourne VIC 3000',
    owner: 'Harry Styles',
    type: 'Owned',
    termLimitation: 3,
    coodinates: [
      [-37.806926580878084, 144.95177196964107],
      [-37.80599414364862, 144.9568359802612],
      [-37.80806244305086, 144.9573938797363],
      [-37.80916438219314, 144.95256590350948]
    ]
  })
]