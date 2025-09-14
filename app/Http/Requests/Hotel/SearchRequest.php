<?php

namespace App\Http\Requests\Hotel;

use Illuminate\Foundation\Http\FormRequest;

class SearchRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'query' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:100',
            'country' => 'nullable|string|max:100',
            'stars' => 'nullable|integer|min:1|max:5',
            'min_price' => 'nullable|numeric|min:0',
            'max_price' => 'nullable|numeric|min:0|gt:min_price',
            'sort_by' => 'nullable|string|in:relevance,price_asc,price_desc,stars,name',
            'per_page' => 'nullable|integer|min:1|max:50',
            'use_elasticsearch' => 'nullable|boolean'
        ];
    }

    public function messages(): array
    {
        return [
            'max_price.gt' => 'Maximum price must be greater than minimum price.',
            'stars.min' => 'Star rating must be at least 1.',
            'stars.max' => 'Star rating cannot exceed 5.',
        ];
    }
}
