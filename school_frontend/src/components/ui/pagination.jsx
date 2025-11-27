"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"

function Pagination({ previous, next, onPrevious, onNext }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <Button
        variant="outline"
        onClick={() => previous && onPrevious && onPrevious()}
        disabled={!previous}
        className={"px-3"}
      >
        Página anterior
      </Button>
      <Button
        variant="outline"
        onClick={() => next && onNext && onNext()}
        disabled={!next}
        className={"px-3"}
      >
        Página siguiente
      </Button>
    </div>
  )
}

export { Pagination }
