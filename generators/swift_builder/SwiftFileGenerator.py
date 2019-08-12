
from abc import ABC, abstractmethod


class SwiftFileGenerator(ABC):
    @abstractmethod
    def generate(self):
        raise NotImplementedError('need to override method')
