"use client"

import React, { useState, useEffect } from "react"
import styles from "./AnimatedText.module.css"

export default function AnimatedText({ texts, highlightClass = "text-blue-600" }) {
  const [{ before, highlight, after }] = texts
  const fullText = before + highlight + after

  const [displayedText, setDisplayedText] = useState("")
  const [index, setIndex] = useState(0)
  const [forward, setForward] = useState(true)  // Animasiyanı irəli və ya geriyə aparmaq üçün

  useEffect(() => {
    let timeout

    if (forward) {
      if (index < fullText.length) {
        timeout = setTimeout(() => setIndex(index + 1), 80)
      } else {
        // Bitdikdən sonra geri sönmə animasiyası üçün (optional)
        timeout = setTimeout(() => setForward(false), 1000)
      }
    } else {
      if (index > 0) {
        timeout = setTimeout(() => setIndex(index - 1), 40)
      } else {
        timeout = setTimeout(() => setForward(true), 500)
      }
    }

    setDisplayedText(fullText.slice(0, index))

    return () => clearTimeout(timeout)
  }, [index, forward, fullText])

  return (
    <span>
      {
        displayedText.length <= before.length ? (
          <>{displayedText}</>
        ) : displayedText.length <= before.length + highlight.length ? (
          <>
            {before}
            <span className={highlightClass}>
              {displayedText.slice(before.length)}
            </span>
          </>
        ) : (
          <>
            {before}
            <span className={highlightClass}>{highlight}</span>
            {displayedText.slice(before.length + highlight.length)}
          </>
        )
      }
      <span className={styles.blinkingCursor}>|</span>
    </span>
  )
}
