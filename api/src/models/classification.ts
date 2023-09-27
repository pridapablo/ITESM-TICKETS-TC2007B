import { Schema, model } from 'mongoose';

const CategorySchema = new Schema({
    name: String,
    subcategories: [String],
});

export const Category = model('Category', CategorySchema);