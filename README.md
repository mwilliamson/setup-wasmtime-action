# setup-wasmtime-action

This actions adds the wasmtime binary to PATH.

## Usage

```yaml
- name: Use wasmtime ${{ matrix.wasmtime-version }}
  uses: mwilliamson/setup-wasmtime-action@v1
  with:
    wasmtime-version: "0.21.0"
```
