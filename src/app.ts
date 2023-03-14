import Koa from 'koa'
import cors from '@koa/cors'
import { v4 as uuidv4 } from 'uuid'
import getLogger from '../logger'
import bodyParser from 'koa-bodyparser'
import router from './routes'
const app = new Koa()
const PORT = 3000

app.use(cors())
app.use(bodyParser())

app.use(router.routes()).use(router.allowedMethods())
// view engine setup
// app.set('views', join(__dirname, 'views'));
// app.set('view engine', 'jade');

// app.use(logger('dev'));
// app.use(json());
// app.use(urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(_static(join(__dirname, 'public')));


// app.use('/', indexRouter)
// app.use('/user', usersRouter)
// app.use('/article', articleRouter)


// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function(
//   err: { message: any; status: any; },
//   req: { app: { get: (arg0: string) => string; }; },
//   res: {
//     locals: { message: any; error: any; };
//     status: (arg0: any) => void;
//     render: (arg0: string) => void;
//   },
//   next: NextFunction) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   // res.status(err.status || 500);
//   // res.render('error');
// });

app.listen(PORT, () => {
  console.log(`Koa with Typescript! http://localhost:${PORT}`)
})

export default app
