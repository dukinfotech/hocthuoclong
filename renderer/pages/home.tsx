import React, { useEffect, useRef, useState } from 'react'
import Head from 'next/head'
import { Button } from '@nextui-org/react';

export default function HomePage() {
  const [showSticky, setShowSticky] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const isFirstRender = useRef<boolean>(true)

  useEffect(() => {
    window.ipc.on('sticky:isRendering', (arg: boolean) => {
      setIsLoading(arg)
    })
  }, [])

  useEffect(() => {
    if (!isFirstRender.current) {
      window.ipc.send('system:showSticky', showSticky);
    } else {
      isFirstRender.current = false
    }
  }, [showSticky])

  const runInSystemTray = () => {
    window.ipc.send('system:runInSystemTray', true);
  }

  return (
    <React.Fragment>
      <Head>
        <title>Home - Nextron (with-tailwindcss)</title>
      </Head>
      <div className="grid grid-col-1 text-2xl text-center">
        <Button color="success" onClick={runInSystemTray}>Run In System Tray</Button>
        <Button color="primary" onClick={() => setShowSticky(!showSticky)} isLoading={isLoading}>
          {showSticky ? 'Hide Sticky' : 'Show Sticky'}
        </Button>
      </div>
    </React.Fragment>
  )
}
