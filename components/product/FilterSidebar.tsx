export default function FilterSidebar() {
    return (
        <div className="bg-white p-4 rounded-2xl shadow-md space-y-6">

            <h2 className="font-semibold text-lg">Filters</h2>

            {/* CATEGORY */}
            <div>
                <p className="font-medium mb-2">Category</p>
                <div className="flex flex-col gap-3">
                    <label><input type="checkbox" /> Shoes</label>
                    <label><input type="checkbox" /> Clothes</label>
                </div>

                <div className="h-px bg-gray-300 my-2" />

                <p className="font-medium mb-2">Brands</p>
                <div className="flex flex-col gap-3">
                    <label><input type="checkbox" /> Brand 1</label>
                    <label><input type="checkbox" /> Brand 2</label>
                </div>
            </div>

        </div>
    );
}