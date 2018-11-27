#' <Add Title>
#'
#' <Add Description>
#'
#' @import htmlwidgets
#'
#' @export
simpleD3Bar <- function(data, colors = NULL, width = NULL, height = NULL, elementId = NULL) {

  # List of settings to pass to d3
  settings = list(
    colors = colors
  )

  # forward options using x
  x = list(
    data = data,
    setting = settings
  )

  # create widget
  htmlwidgets::createWidget(
    name = 'simpleD3Bar',
    x,
    width = width,
    height = height,
    package = 'simpled3',
    elementId = elementId
  )
}

#' Shiny bindings for simpleD3Bar
#'
#' Output and render functions for using simpleD3Bar within Shiny
#' applications and interactive Rmd documents.
#'
#' @param outputId output variable to read from
#' @param width,height Must be a valid CSS unit (like \code{'100\%'},
#'   \code{'400px'}, \code{'auto'}) or a number, which will be coerced to a
#'   string and have \code{'px'} appended.
#' @param expr An expression that generates a simpleD3Bar
#' @param env The environment in which to evaluate \code{expr}.
#' @param quoted Is \code{expr} a quoted expression (with \code{quote()})? This
#'   is useful if you want to save an expression in a variable.
#'
#' @name simpleD3Bar-shiny
#'
#' @export
simpleD3BarOutput <- function(outputId, width = '100%', height = '400px'){
  htmlwidgets::shinyWidgetOutput(outputId, 'simpleD3Bar', width, height, package = 'simpled3')
}

#' @rdname simpleD3Bar-shiny
#' @export
renderSimpleD3Bar <- function(expr, env = parent.frame(), quoted = FALSE) {
  if (!quoted) { expr <- substitute(expr) } # force quoted
  htmlwidgets::shinyRenderWidget(expr, simpleD3BarOutput, env, quoted = TRUE)
}
