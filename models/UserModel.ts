import { User } from './interfaces'
import * as R from 'ramda'
import { db } from '../firebase/app'
import {
   collection,
   deleteDoc,
   doc,
   getDoc,
   getDocs,
   onSnapshot,
   query,
   Query,
   QueryConstraint,
   setDoc,
   Unsubscribe
} from 'firebase/firestore'
import Model from './Model'

export default class UserModel extends Model<User> {

   private user: User

   constructor(user: Omit<User, 'admin' | 'master'>) {
      super()
      this.user = this.ensureDateType(user)
   }
   
   static get PATH(): string { return 'users' }

   static async find(id: string) {
      const docRef = await getDoc(doc(db, UserModel.PATH, id))
      
      if (!docRef.exists()) return null

      const userModel = new UserModel(docRef.data() as User)

      return userModel
   }

   static async findMany(constraints: QueryConstraint[] = []) {
      const q = query(collection(db, UserModel.PATH), ...constraints)
      const users: UserModel[] = []
      const { docs } = await getDocs(q)
      docs.forEach(doc => users.push(new UserModel(doc.data() as User)))
      return users
   }

   static listenToAll(setFunction: Function): Unsubscribe {
      const q = query(collection(db, UserModel.PATH))
      
      const unsubscribe = onSnapshot(q, snapshot => {
         const users: UserModel[] = []
         snapshot.forEach(document => {
            const user = document.data()
            if (user.dateOfBirth) {
               user.dateOfBirth = user.dateOfBirth.toDate()
            }
            if (user.signUpDate) {
               user.signUpDate = user.signUpDate.toDate()
            }
            const userModel = new UserModel(user as User)
            users.push(userModel)
         })
         setFunction(users)
      })
      
      return unsubscribe
   }

   static listenToQuery(q: Query, setFunction: Function): Unsubscribe {
      const unsubscribe = onSnapshot(q, snapshot => {
         const users: UserModel[] = []
         snapshot.forEach(document => {
            const user = document.data()
            if (user.dateOfBirth) {
               user.dateOfBirth = user.dateOfBirth.toDate()
            }
            const userModel = new UserModel(user as User)
            users.push(userModel)
         })
         setFunction(users)
      })
      
      return unsubscribe
   }

   get id()             { return this.user.id }
   get firstName()      { return this.user.firstName }
   get lastName()       { return this.user.lastName }
   get emailAddress()   { return this.user.emailAddress }
   get phoneContact1()  { return this.user.phoneContact1 }
   get phoneContact2()  { return this.user.phoneContact2 }
   get addresses()      { return this.user.addresses }
   get dateOfBirth()    { return this.user.dateOfBirth }
   get admin()          { return this.user.admin }
   get master()         { return this.user.master }
   get signUpDate()     { return this.user.signUpDate }

   get fullName()       { return `${this.user.firstName} ${this.user.lastName}` }

   values() {
      return this.user
   }

   isValid() {
      if (!this.id ||!this.firstName ||!this.lastName || !this.emailAddress) return false

      return true
   }

   modify(values: Partial<Omit<User, 'admin' | 'master'>>) {
      this.user = R.mergeRight(this.values(), values)
   }

   addAdminRole(isMasterUser = false) {
      if (isMasterUser && !this.admin) this.user = R.mergeRight(this.user, { admin: true })
   }

   removeAdminRole(isMasterUser = false) {
      if (isMasterUser && this.admin) this.user = R.dissoc('admin', this.user)
   }

   async save() {
      if (!this.isValid()) throw new Error('One or more of the values is/are not valid')

      const docRef = doc(db, UserModel.PATH, this.id)
      
      await setDoc(docRef, this.values())
   }

   async delete() {
      return await deleteDoc(doc(db, UserModel.PATH, this.id))
   }

   mainAddressToString() {
      if (R.isNil(this.addresses)) return ''
      const mainAddress = R.find(R.propEq('isMain', true), this.addresses)
      return `${mainAddress?.description}, ${mainAddress?.zipCode}`
   }

   toString() {
      return `${this.firstName} ${this.lastName}`
   }

   signUpDateToString() {
      const day = this.signUpDate.getDate() < 10 ?`0${this.signUpDate.getDate()}` : this.signUpDate.getDate()
      const month = this.signUpDate.getMonth() + 1 < 10 ? `0${this.signUpDate.getMonth() + 1}` : this.signUpDate.getMonth() + 1
      const year = this.signUpDate.getFullYear()
      return `${day}/${month}/${year}`
   }

   private ensureDateType(values: User): User {
      if (values.signUpDate instanceof Date) return values
      const timestamp: any = values.signUpDate
      return R.assoc('signUpDate', timestamp.toDate(), R.dissoc('signUpDate', R.clone(values)))
   }
}
