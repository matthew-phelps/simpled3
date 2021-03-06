#' D3 line
#'
#' Just a simple legend.
#'
#' @import htmlwidgets
#' @param data data to be sent to JS
#' @param colors Colors to be sent to JS
#' @param width Width if specified
#' @param height Height if specified
#' @param elementId Id if specified
#'
#' @export
simpleD3Line <- function(data, colors, plotTitle, sexVars, dataVar, lang, width = NULL, height = NULL, elementId = NULL) {

    # List of settings to pass to d3
  metaData = list(
    colors = colors,
    plotTitle = plotTitle,
    sexVars = sexVars,
    dataVar = dataVar,
    lang = lang
  )

  # forward options using x
  x = list(
    data = data,
    metaData = metaData
  )


  # create widget
  htmlwidgets::createWidget(
    name = 'simpleD3Line',
    x,
    width = width,
    height = height,
    package = 'simpled3',
    elementId = elementId
  )
}

#' Shiny bindings for simpled3
#'
#' Output and render functions for using simpled3 within Shiny
#' applications and interactive Rmd documents.
#'
#' @param outputId output variable to read from
#' @param width,height Must be a valid CSS unit (like \code{'100\%'},
#'   \code{'400px'}, \code{'auto'}) or a number, which will be coerced to a
#'   string and have \code{'px'} appended.
#' @param expr An expression that generates a simpled3
#' @param env The environment in which to evaluate \code{expr}.
#' @param quoted Is \code{expr} a quoted expression (with \code{quote()})? This
#'   is useful if you want to save an expression in a variable.
#'
#' @name simpleD3Line-shiny
#'
#' @export
simpleD3LineOutput <- function(outputId, width = '100%', height = '400px'){
  htmlwidgets::shinyWidgetOutput(outputId, 'simpleD3Line', width, height, package = 'simpled3')
}

#' @rdname simpleD3Line-shiny
#' @export
renderSimpleD3Line <- function(expr, env = parent.frame(), quoted = FALSE) {
  if (!quoted) { expr <- substitute(expr) } # force quoted
  htmlwidgets::shinyRenderWidget(expr, simpleD3LineOutput, env, quoted = TRUE)
}
