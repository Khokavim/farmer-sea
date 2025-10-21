import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Upload, X, Plus } from 'lucide-react';
import { CreateProductData, ProductCategory, QualityGrade } from '@/types/product';

const productSchema = z.object({
  name: z.string().min(2, 'Product name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.enum(['vegetables', 'fruits', 'grains', 'tubers', 'herbs', 'other']),
  price: z.number().min(1, 'Price must be greater than 0'),
  unit: z.string().min(1, 'Unit is required'),
  quantity: z.number().min(1, 'Quantity must be greater than 0'),
  quality: z.enum(['A+', 'A', 'B', 'C']),
  location: z.string().min(2, 'Location is required'),
  harvestDate: z.string().min(1, 'Harvest date is required'),
  expiryDate: z.string().optional(),
  tags: z.string().optional(),
  specifications: z.object({
    weight: z.string().optional(),
    size: z.string().optional(),
    color: z.string().optional(),
    origin: z.string().optional(),
  }).optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  onSubmit: (data: CreateProductData) => Promise<void>;
  onCancel?: () => void;
  initialData?: Partial<CreateProductData>;
  isLoading?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({ 
  onSubmit, 
  onCancel, 
  initialData,
  isLoading = false 
}) => {
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      category: initialData?.category || 'vegetables',
      price: initialData?.price || 0,
      unit: initialData?.unit || 'kg',
      quantity: initialData?.quantity || 0,
      quality: initialData?.quality || 'A',
      location: initialData?.location || '',
      harvestDate: initialData?.harvestDate || '',
      expiryDate: initialData?.expiryDate || '',
      tags: initialData?.tags?.join(', ') || '',
      specifications: initialData?.specifications || {},
    },
  });

  const watchedCategory = watch('category');

  const categories: { value: ProductCategory; label: string }[] = [
    { value: 'vegetables', label: 'Vegetables' },
    { value: 'fruits', label: 'Fruits' },
    { value: 'grains', label: 'Grains' },
    { value: 'tubers', label: 'Tubers' },
    { value: 'herbs', label: 'Herbs' },
    { value: 'other', label: 'Other' },
  ];

  const qualityGrades: { value: QualityGrade; label: string }[] = [
    { value: 'A+', label: 'A+ (Premium)' },
    { value: 'A', label: 'A (Excellent)' },
    { value: 'B', label: 'B (Good)' },
    { value: 'C', label: 'C (Fair)' },
  ];

  const units = ['kg', 'tonnes', 'pieces', 'bags', 'crates', 'bunches'];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      // Mock image upload - replace with actual upload logic
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setImages(prev => [...prev, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const onFormSubmit = async (data: ProductFormData) => {
    try {
      setError(null);
      
      const productData: CreateProductData = {
        ...data,
        images,
        tags: data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
      };
      
      await onSubmit(productData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create product');
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Add New Product</CardTitle>
        <CardDescription>
          List your farm produce on the marketplace
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Jos Irish Potatoes"
                  {...register('name')}
                  disabled={isLoading}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select onValueChange={(value) => setValue('category', value as ProductCategory)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-destructive">{errors.category.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe your product, its quality, and benefits..."
                rows={3}
                {...register('description')}
                disabled={isLoading}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description.message}</p>
              )}
            </div>
          </div>

          {/* Pricing & Inventory */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Pricing & Inventory</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price per Unit (₦) *</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="450"
                  {...register('price', { valueAsNumber: true })}
                  disabled={isLoading}
                />
                {errors.price && (
                  <p className="text-sm text-destructive">{errors.price.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit">Unit *</Label>
                <Select onValueChange={(value) => setValue('unit', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.unit && (
                  <p className="text-sm text-destructive">{errors.unit.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Available Quantity *</Label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder="50000"
                  {...register('quantity', { valueAsNumber: true })}
                  disabled={isLoading}
                />
                {errors.quantity && (
                  <p className="text-sm text-destructive">{errors.quantity.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Quality & Location */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quality & Location</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quality">Quality Grade *</Label>
                <Select onValueChange={(value) => setValue('quality', value as QualityGrade)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select quality grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {qualityGrades.map((grade) => (
                      <SelectItem key={grade.value} value={grade.value}>
                        {grade.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.quality && (
                  <p className="text-sm text-destructive">{errors.quality.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  placeholder="e.g., Jos North LGA, Plateau State"
                  {...register('location')}
                  disabled={isLoading}
                />
                {errors.location && (
                  <p className="text-sm text-destructive">{errors.location.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Harvest & Expiry</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="harvestDate">Harvest Date *</Label>
                <Input
                  id="harvestDate"
                  type="date"
                  {...register('harvestDate')}
                  disabled={isLoading}
                />
                {errors.harvestDate && (
                  <p className="text-sm text-destructive">{errors.harvestDate.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date (Optional)</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  {...register('expiryDate')}
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Product Images</h3>
            
            <div className="space-y-2">
              <Label>Upload Images</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">
                  Upload product images (max 5 images)
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('image-upload')?.click()}
                  disabled={isLoading}
                >
                  Choose Images
                </Button>
              </div>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`Product ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                      onClick={() => removeImage(index)}
                      disabled={isLoading}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (Optional)</Label>
            <Input
              id="tags"
              placeholder="organic, fresh, premium (comma separated)"
              {...register('tags')}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              Add tags to help buyers find your product
            </p>
          </div>

          {/* Specifications */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Product Specifications (Optional)</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weight">Weight per Unit</Label>
                <Input
                  id="weight"
                  placeholder="e.g., 50-100g per piece"
                  {...register('specifications.weight')}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="size">Size</Label>
                <Input
                  id="size"
                  placeholder="e.g., Medium to Large"
                  {...register('specifications.size')}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <Input
                  id="color"
                  placeholder="e.g., Light brown"
                  {...register('specifications.color')}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="origin">Origin</Label>
                <Input
                  id="origin"
                  placeholder="e.g., Jos, Plateau State"
                  {...register('specifications.origin')}
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-6">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Product...
                </>
              ) : (
                'Create Product'
              )}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProductForm;

