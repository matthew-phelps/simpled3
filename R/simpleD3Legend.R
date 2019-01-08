#' D3 legend
#'
#' Just a simple legend
#'
#' @import htmlwidgets
#'
#' @export
simpleD3Legend <- function(data, width = NULL, height = NULL, elementId = NULL) {

  # forward options using x
  x = list(
    data = data
  )

  # create widget
  htmlwidgets::createWidget(
    name = 'simpleD3Legend',
    x,
    width = width,
    height = height,
    package = 'simpled3',
    elementId = elementId
  )
}

#' Shiny bindings for simpleD3Legend
#'
#' Output and render functions for using simpleD3Legend within Shiny
#' applications and interactive Rmd documents.
#'
#' @param outputId output variable to read from
#' @param width,height Must be a valid CSS unit (like \code{'100\%'},
#'   \code{'400px'}, \code{'auto'}) or a number, which will be coerced to a
#'   string and have \code{'px'} appended.
#' @param expr An expression that generates a simpleD3Legend
#' @param env The environment in which to evaluate \code{expr}.
#' @param quoted Is \code{expr} a quoted expression (with \code{quote()})? This
#'   is useful if you want to save an expression in a variable.
#'
#' @name simpleD3Legend-shiny
#'
#' @export
simpleD3LegendOutput <- function(outputId, width = '100%', height = '400px'){
  htmlwidgets::shinyWidgetOutput(outputId, 'simpleD3Legend', width, height, package = 'simpled3')
}

#' @rdname simpleD3Legend-shiny
#' @export
renderSimpleD3Legend <- function(expr, env = parent.frame(), quoted = FALSE) {
  if (!quoted) { expr <- substitute(expr) } # force quoted
  htmlwidgets::shinyRenderWidget(expr, simpleD3LegendOutput, env, quoted = TRUE)
}
