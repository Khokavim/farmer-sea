import { useState } from 'react';
import { useProducts } from '@/contexts/ProductContextNew';
import { ProductProvider } from '@/contexts/ProductContextNew';
import ProductCard from '@/components/products/ProductCard';
import ProductFilters from '@/components/products/ProductFilters';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  SortAsc, 
  SortDesc,
  Plus,
  Loader2
} from 'lucide-react';
import { Product, ProductFilters as ProductFiltersType } from '@/types/product';

const MarketplaceContent = () => {
  const { 
    products, 
    categories, 
    isLoading, 
    error, 
    filters, 
    setFilters, 
    fetchProducts 
  } = useProducts();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'date' | 'rating'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setFilters({ ...filters, search: query });
  };

  const handleFilterChange = (newFilters: ProductFiltersType) => {
    setFilters({ ...filters, ...newFilters });
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      search: '',
      minPrice: 0,
      maxPrice: 10000,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
    setSearchQuery('');
  };

  const handleSort = (field: 'name' | 'price' | 'date' | 'rating') => {
    if (sortBy === field) {
      const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
      setSortOrder(newOrder);
      setFilters({ ...filters, sortBy: field, sortOrder: newOrder });
    } else {
      setSortBy(field);
      setSortOrder('desc');
      setFilters({ ...filters, sortBy: field, sortOrder: 'desc' });
    }
  };

  const sortedProducts = [...products].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'price':
        comparison = a.price - b.price;
        break;
      case 'date':
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
      case 'rating':
        // Mock rating for now
        comparison = 0;
        break;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => 
      value !== undefined && value !== '' && value !== null
    ).length;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Page Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Marketplace</h1>
              <p className="text-muted-foreground">
                Discover fresh produce from verified farmers across Nigeria
              </p>
            </div>
            <Button className="bg-primary hover:bg-primary-hover text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" />
              List Product
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="sticky top-24">
              <ProductFilters
                filters={filters}
                onFiltersChange={handleFilterChange}
                onClearFilters={clearFilters}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search and Controls */}
            <div className="mb-6 space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search products, farmers, or locations..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Controls */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Sort by:</span>
                    <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="name">Name</SelectItem>
                        <SelectItem value="price">Price</SelectItem>
                        <SelectItem value="date">Date</SelectItem>
                        <SelectItem value="rating">Rating</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSort(sortBy)}
                    >
                      {sortOrder === 'asc' ? (
                        <SortAsc className="w-4 h-4" />
                      ) : (
                        <SortDesc className="w-4 h-4" />
                      )}
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">View:</span>
                    <div className="flex border rounded-lg">
                      <Button
                        variant={viewMode === 'grid' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('grid')}
                        className="rounded-r-none"
                      >
                        <Grid className="w-4 h-4" />
                      </Button>
                      <Button
                        variant={viewMode === 'list' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('list')}
                        className="rounded-l-none"
                      >
                        <List className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {getActiveFiltersCount() > 0 && (
                    <Badge variant="secondary">
                      {getActiveFiltersCount()} filters active
                    </Badge>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden"
                  >
                    <Filter className="w-4 h-4 mr-1" />
                    Filters
                  </Button>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">Loading products...</p>
                  </div>
                </div>
              ) : sortedProducts.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <div className="space-y-4">
                      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                        <Search className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">No products found</h3>
                        <p className="text-muted-foreground">
                          Try adjusting your search criteria or filters
                        </p>
                      </div>
                      <Button variant="outline" onClick={clearFilters}>
                        Clear Filters
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {/* Results Summary */}
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Showing {sortedProducts.length} of {products.length} products
                    </p>
                    <div className="text-sm text-muted-foreground">
                      Sorted by {sortBy} ({sortOrder})
                    </div>
                  </div>

                  {/* Products Grid/List */}
                  <div className={
                    viewMode === 'grid' 
                      ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                      : 'space-y-4'
                  }>
                    {sortedProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onView={(product) => {
                          // Handle view product
                          console.log('View product:', product);
                        }}
                        onAddToCart={(product) => {
                          // Handle add to cart
                          console.log('Add to cart:', product);
                        }}
                        showActions={true}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

const Marketplace = () => {
  return (
    <ProductProvider>
      <MarketplaceContent />
    </ProductProvider>
  );
};

export default Marketplace;
