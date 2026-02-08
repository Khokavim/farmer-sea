import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { X, Filter } from 'lucide-react';
import { ProductFilters, ProductCategory, QualityGrade, ProductStatus } from '@/types/product';

interface ProductFiltersProps {
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  onClearFilters: () => void;
}

const ProductFiltersComponent: React.FC<ProductFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

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

  const statuses: { value: ProductStatus; label: string }[] = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'pending', label: 'Pending' },
    { value: 'out_of_stock', label: 'Out of Stock' },
  ];

  const handleFilterChange = <K extends keyof ProductFilters>(key: K, value: ProductFilters[K]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const handlePriceRangeChange = (value: number[]) => {
    onFiltersChange({
      ...filters,
      minPrice: value[0],
      maxPrice: value[1],
    });
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => 
      value !== undefined && value !== '' && value !== null
    ).length;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge variant="secondary">{activeFiltersCount}</Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            {activeFiltersCount > 0 && (
              <Button variant="outline" size="sm" onClick={onClearFilters}>
                <X className="w-3 h-3 mr-1" />
                Clear
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Collapse' : 'Expand'}
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-6">
          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="search">Search Products</Label>
            <Input
              id="search"
              placeholder="Search by name or description..."
              value={filters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={filters.category || ''}
              onValueChange={(value) => handleFilterChange('category', (value || undefined) as ProductCategory | undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Quality Grade */}
          <div className="space-y-2">
            <Label>Quality Grade</Label>
            <Select
              value={filters.quality || ''}
              onValueChange={(value) => handleFilterChange('quality', (value || undefined) as QualityGrade | undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All grades" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All grades</SelectItem>
                {qualityGrades.map((grade) => (
                  <SelectItem key={grade.value} value={grade.value}>
                    {grade.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={filters.status || ''}
              onValueChange={(value) => handleFilterChange('status', (value || undefined) as ProductStatus | undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All statuses</SelectItem>
                {statuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="Filter by location..."
              value={filters.location || ''}
              onChange={(e) => handleFilterChange('location', e.target.value)}
            />
          </div>

          {/* Price Range */}
          <div className="space-y-3">
            <Label>Price Range (₦)</Label>
            <div className="px-3">
              <Slider
                value={[filters.minPrice || 0, filters.maxPrice || 10000]}
                onValueChange={handlePriceRangeChange}
                max={10000}
                min={0}
                step={100}
                className="w-full"
              />
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>₦{filters.minPrice || 0}</span>
              <span>₦{filters.maxPrice || 10000}</span>
            </div>
          </div>

          {/* Active Filters Display */}
          {activeFiltersCount > 0 && (
            <div className="space-y-2">
              <Label>Active Filters</Label>
              <div className="flex flex-wrap gap-2">
                {filters.search && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Search: {filters.search}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => handleFilterChange('search', '')}
                    />
                  </Badge>
                )}
                {filters.category && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Category: {categories.find(c => c.value === filters.category)?.label}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => handleFilterChange('category', undefined)}
                    />
                  </Badge>
                )}
                {filters.quality && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Quality: {filters.quality}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => handleFilterChange('quality', undefined)}
                    />
                  </Badge>
                )}
                {filters.status && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Status: {statuses.find(s => s.value === filters.status)?.label}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => handleFilterChange('status', undefined)}
                    />
                  </Badge>
                )}
                {filters.location && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Location: {filters.location}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => handleFilterChange('location', '')}
                    />
                  </Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};

export default ProductFiltersComponent;
