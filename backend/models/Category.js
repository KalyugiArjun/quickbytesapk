import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide category name'],
      unique: true,
      trim: true
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80'
    },
    description: {
      type: String,
      default: 'Explore delicious items in this category'
    },
    isActive: {
      type: Boolean,
      default: true
    },
    displayOrder: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

categorySchema.pre('save', function (next) {
  if (this.isModified('name') || !this.slug) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
  }
  next();
});

const Category = mongoose.model('Category', categorySchema);
export default Category;
