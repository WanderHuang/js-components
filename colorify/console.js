const {Colorify} = require('./color.js')
Colorify.green().underline().write('Green').show()
Colorify.cyan().underline().wrap('@').write('Cyan').wrap('-').yellow().write('Yellow').show()
Colorify
  .red().underline().wrap('-').write('RED WORDS')
  .cyan().wrap('*').write('cyan').write('cyan')
  .yellow().write('yellow')
  .show()
  .blue().write('LOG blue--->')
  .show()