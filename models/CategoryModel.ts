import { Category } from './interfaces'
import * as R from 'ramda'
import { db } from '../firebase/app'
import { collection, deleteDoc, doc, getDoc, onSnapshot, query, Query, setDoc, Unsubscribe } from "firebase/firestore";
import Model from './Model';

export default class CategoryModel extends Model<Category> {

   constructor(private category: Category) {
      super()
   }
   
   static get PATH(): string { return 'categories' }

   static async find(id: string) {
      const docRef = await getDoc(doc(db, CategoryModel.PATH, id))
      
      if (!docRef.exists()) return null

      const categoryModel = new CategoryModel(docRef.data() as Category)

      return categoryModel
   }

   static listenToAll(setFunction: Function): Unsubscribe {
      const q = query(collection(db, CategoryModel.PATH))
      
      const unsubscribe = onSnapshot(q, snapshot => {
         const categories: CategoryModel[] = []
         snapshot.forEach(document => {
            const categoryModel = new CategoryModel(document.data() as Category)
            categories.push(categoryModel)
         })
         setFunction(categories)
      })
      
      return unsubscribe
   }

   static listenToQuery(q: Query, setFunction: Function): Unsubscribe {
      const unsubscribe = onSnapshot(q, snapshot => {
         const categories: CategoryModel[] = []
         snapshot.forEach(document => {
            const categoryModel = new CategoryModel(document.data() as Category)
            categories.push(categoryModel)
         })
         setFunction(categories)
      })
      
      return unsubscribe
   }

   values() {
      return this.category
   }

   isValid() {
      const { id, name } = this.values()

      if (!id || !name) return false

      if (id.length !== 13) return false

      return true
   }

   modify(values: Partial<Omit<Category, 'id'>>) {
      this.category = R.mergeRight(this.values(), values)
   }

   async save() {
      if (!this.isValid()) throw new Error('One or more of the values is/are not valid')

      const { id } = this.values()
      
      const docRef = doc(db, CategoryModel.PATH, id)
      
      await setDoc(docRef, this.values())
   }

   async delete() {
      const { id } = this.values()

      return await deleteDoc(doc(db, CategoryModel.PATH, id))
   }

   toString() {
      return this.values().name
   }
}
