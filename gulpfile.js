import gulp from "gulp";

import * as dartSass from "sass";
import gulpSass from 'gulp-sass';
import autoPrefixer from "gulp-autoprefixer";
import GulpCleanCss from "gulp-clean-css";

import rename from "gulp-rename";
import {deleteAsync} from 'del';

import svgSprite from "gulp-svg-sprite";
import webpackStream from "webpack-stream";
import htmlmin from "gulp-htmlmin";
import browserSync from "browser-sync";

const sass = gulpSass(dartSass);



function styles() {
    return gulp.src("src/style.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(autoPrefixer(["last 15 version"]))
    .pipe(GulpCleanCss())
    .pipe(rename({ suffix: ".min"}))
    .pipe(gulp.dest("dist"))
    .pipe(browserSync.stream())
}

function html() {
  return gulp.src("src/*.html")
  .pipe(htmlmin({
    collapseWhitespace: true,
    removeComments: true
  }))
  .pipe(gulp.dest("dist"))
  .pipe(browserSync.stream())
}

function copy() {
    return gulp.src(["src/assets/fonts/*", "src/assets/images/*", "src/assets/images/!(icons)"], {base: "src"})
    .pipe(gulp.dest("dist"))
    .pipe(browserSync.stream())
}

function delDist() {
    return deleteAsync(["dist/**"])
}
function spriteSVG () {
    return gulp.src("src/assets/images/icons/*.svg")
    .pipe(svgSprite( {
        mode: {
            symbol: {
                sprite: "../sprite.svg"
            }
        }
    }
        
    ))
    .pipe(gulp.dest("src/assets/images/"));
}

function scripts () {
    return gulp.src("src/app.js")
    .pipe(webpackStream({
        mode: "production",
        module: {
            rules: [
              {
                test: /\.(?:js|mjs|cjs)$/,
                exclude: /node_modules/,
                use: {
                  loader: 'babel-loader',
                  options: {
                    presets: [
                      ['@babel/preset-env', { targets: "defaults" }]
                    ]
                  }
                }
              }
            ]
          }
    }))
    .pipe(rename("app.min.js"))
    .pipe(gulp.dest("dist"))
    .pipe(browserSync.stream())
}

function svg() {
  return gulp.src("src/assets/images/icons/*.svg")
  .pipe(svgSprite({
    mode: {
      stack: {
        sprite: "../sprite.svg"
      }
    }
  }))
  .pipe(gulp.dest("src/assets/images/"))
}

function server () {
  browserSync.init({
    server: {
      baseDir: "dist"
    }
  })
}

function watch () {
  gulp.watch(["src/assets/fonts/*", "src/assets/images/**/*", "src/assets/images/!(icons)/*", "src/favicons/*"], copy);
  gulp.watch(["src/assets/images/icons/*"],svg);
  gulp.watch("src/**/*.scss", styles);
  gulp.watch(["src/*.js"], scripts);
  gulp.watch("src/*.html", html);
}

export {svg}

export const build = gulp.series(delDist, html, styles, scripts, copy)

export default gulp.series(delDist, gulp.parallel(html, styles, scripts, copy), gulp.parallel(server, watch))