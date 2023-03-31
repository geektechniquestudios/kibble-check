import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { DayTile } from "./DayTile"

export const MainTileAuthed: React.FC = () => {
  const tiles = Array.from({ length: 7 }).map((_, index) => (
    <DayTile key={index} index={index} />
  ))

  const [selectedTileIndex, setSelectedTileIndex] = useState(
    Math.floor(tiles.length / 2),
  )

  const [scrollValue, setScrollValue] = useState(0)

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault()

      if (event.deltaY < 0) {
        // Scroll up
        setScrollValue(scrollValue + 1)
        console.log(scrollValue)
      } else {
        // Scroll down
        setScrollValue(scrollValue - 1)
        console.log(scrollValue)
      }
    }

    const gridContainer = document.getElementById("grid-container")
    if (gridContainer) {
      gridContainer.addEventListener("wheel", handleWheel)
    }

    return () => {
      if (gridContainer) {
        gridContainer.removeEventListener("wheel", handleWheel)
      }
    }
  }, [scrollValue])

  return (
    <div className="flex h-[36em] shrink-0 flex-col place-content-center overflow-hidden rounded-md border border-yellow-600 bg-red-900 bg-opacity-50 p-2 sm:flex-row">
      <div className="container grid h-full place-content-center overflow-y-auto p-2 sm:w-1/2">
        <div
          id="grid-container"
          className="relative h-full p-2"
        >
          <div className="-gap-2 grid h-full p-2">
            {tiles.map((tile, index) => {
              const distanceFromSelected = Math.abs(index - selectedTileIndex)
              const scale = 1 - distanceFromSelected / 8
              const opacity = 1 - distanceFromSelected / 4
              const zIndex = tiles.length - distanceFromSelected
              const translateYDirection = index < selectedTileIndex ? 1 : -1
              const translateY =
                distanceFromSelected *
                10 *
                translateYDirection *
                (distanceFromSelected * 1.3)
              const rotateZ = distanceFromSelected * 6

              return (
                <motion.div
                  layout
                  key={index}
                  className=""
                  style={{
                    transform: `scale(${scale}) translateY(${translateY}px) rotateZ(${rotateZ}deg)`,
                    opacity: opacity,
                    zIndex: zIndex,
                  }}
                >
                  {tile}
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
