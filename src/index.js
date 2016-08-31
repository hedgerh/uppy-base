// This was the only way I could figure out how to get modules to import correctly.
// There's definitely a cleaner way to do this!
import D from './plugins/DragDrop'
import M from './plugins/Multipart'
import P from './plugins/Provider'
import T from './plugins/Tus10'
import W from './plugins/Webcam'

export const DragDrop = D
export const Multipart = M
export const Provider = P
export const Tus10 = T
export const Webcam = W
