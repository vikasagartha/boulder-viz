import React, {useEffect, useRef} from 'react'
import milestones from 'd3-milestones'
import '../node_modules/d3-milestones/build/d3-milestones.css'

interface IProps {
  data?: {timestamp: Date, name: string}[];
}

const randomDate = (start: Date, end: Date) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
const randomString = ():string => Math.random().toString(36).substring(7)
const randomBoulderName = ():string => [randomString(), randomString(), randomString()].join(' ')
const randomGrade = ():string => `V${Math.floor(Math.random() * (17 - 0) + 0)}`

const MyD3Component = (props: IProps) => {
  const d3Container = useRef(null);

  const formatDate = (d: Date):string => [
    d.getFullYear(),
    ('0' + (d.getMonth() + 1)).slice(-2),
    ('0' + d.getDate()).slice(-2)
  ].join('-')

  useEffect(
      () => {
          const massaged = props.data.map(d => ({...d, timestamp: formatDate(d.timestamp)}))
          if (props.data && d3Container.current) {
            milestones(d3Container.current)
            .mapping({
              'timestamp': 'timestamp',
              'text': 'name'
            })
            .parseTime('%Y-%m-%d')
            .aggregateBy('day')
            .distribution('top-bottom')
            .orientation('vertical')
            .optimize(true)
            .render(massaged)
          }
      },

      [props.data, d3Container.current])

  return (
      <div
          style={{
            width: 500,
            height: 500,
            padding: 20
          }}
          ref={d3Container}
      />
  );
}

const data = Array.apply(0, new Array(10)).map(() => ({
  timestamp: randomDate(new Date(2012, 0, 1), new Date()),
  name: `${randomBoulderName()} ${randomGrade()}`,
}))

export default function MyApp() {
  return <MyD3Component data={data}/>
}