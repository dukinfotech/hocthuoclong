import { Code } from '@nextui-org/react'
import { RiDraggable } from "react-icons/ri";
import React from 'react'

export default function NextPage() {
  return (
    <React.Fragment>
      <Code color="default" style={{ display: "flex", alignItems: "center" }}>
        <RiDraggable className="draggable"/>
        <span>
          Hello
        </span>
      </Code>
    </React.Fragment>
  )
}
