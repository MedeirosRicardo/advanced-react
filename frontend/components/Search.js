import { useCombobox } from 'downshift';
import { DropDown, DropDownItem, SearchStyles } from './styles/DropDown';
import { gql, useLazyQuery } from '@apollo/client';
import { debounce } from 'lodash';
import { useRouter } from 'next/router';

const SEARCH_PRODUCT_QUERY = gql`
  query SEARCH_PRODUCT_QUERY($searchTerm: String!) {
    searchTerms: products(
      where: {
        OR: [
          {
            name: {
              contains: $searchTerm
            }
          },
          {
            description: {
              contains: $searchTerm
            }
          }
        ]
      }
    ) {
      id
      name
      photo {
        image {
          url
        }
      }
    }
  }
`;

export default function Search() {
  const router = useRouter();
  const [findItems, { loading, data, error }] = useLazyQuery(SEARCH_PRODUCT_QUERY, {
    fetchPolicy: 'no-cache',
  });

  const items = data?.searchTerms || [];

  const findItemsButChill = debounce(findItems, 350);

  const {
    isOpen,
    inputValue,
    getMenuProps,
    getInputProps,
    getItemProps,
    highlightedIndex
  } = useCombobox({
    items: items,
    onInputValueChange() {
      findItemsButChill({
        variables: {
          searchTerm: inputValue,
        },
      });
    },
    onSelectedItemChange({ selectedItem }) {
      router.push({
        pathname: `/product/${selectedItem.id}`
      });
    },
    itemToString: item => item?.name || '',
  });

  return (
    <SearchStyles>
      <div>
        <input {...getInputProps({
          type: 'search',
          placeholder: 'Search for an Item',
          id: 'search',
          className: loading ? 'loading' : '',
        })} />
      </div>
      <DropDown {...getMenuProps()}>
        {isOpen && items.map((item, index) => (
          <DropDownItem
            key={item.id}
            {...getItemProps({ item })}
            highlighted={index === highlightedIndex}
          >
            <img
              src={item.photo.image.url}
              alt={item.name}
              width="50"
            />
            {item.name}
          </DropDownItem>
        ))}
        {isOpen && !items.length && !loading && (
          <DropDownItem>
            Sorry, No items found for {inputValue}
          </DropDownItem>
        )}
      </DropDown>
    </SearchStyles>
  );
}
